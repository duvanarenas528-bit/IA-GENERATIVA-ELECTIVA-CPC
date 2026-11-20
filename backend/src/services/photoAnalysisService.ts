import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { isImageAvailable, readImageBytes } from '../utils/storage.js';
import { ZONE_LABELS } from './preperitajeReport.js';
import { conditionLabel } from './questionnaireCatalog.js';

const AnalisisSchema = z.object({
  estado_general: z.string().min(1),
  hallazgos: z
    .array(
      z.object({
        zona: z.string().optional(),
        titulo: z.string().min(1),
        detalle: z.string().optional(),
        severidad: z.enum(['baja', 'media', 'alta']).optional(),
      })
    )
    .default([]),
  recomendaciones: z.array(z.string()).default([]),
  valoracion: z.object({
    min: z.number(),
    max: z.number(),
    moneda: z.string().optional(),
    factores: z.array(z.string()).optional(),
  }),
});

export type AnalisisFotosIA = z.infer<typeof AnalisisSchema> & {
  generadoEn: string;
  modelo: string;
  fotosAnalizadas: number;
  aviso: string;
};

export class ControlledGeminiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'ControlledGeminiError';
    this.status = status;
  }
}

function extractText(response: any): string {
  return (
    response?.text ||
    response?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('') ||
    ''
  );
}

function parseJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini no devolvió un JSON válido.');
    return JSON.parse(match[0]);
  }
}

function geminiErrorStatus(error: any) {
  return (
    error?.status ??
    error?.code ??
    error?.response?.status ??
    error?.error?.status ??
    error?.error?.code ??
    error?.cause?.status ??
    error?.cause?.code ??
    null
  );
}

function geminiErrorMessage(error: any, fallbackMessage: string) {
  let message = error?.message || error?.error?.message || fallbackMessage;
  if (typeof message === 'string') {
    try {
      const parsed = JSON.parse(message);
      message = parsed?.error?.message || parsed?.message || message;
    } catch {}
  }
  return String(message);
}

export function friendlyGeminiError(
  error: any,
  fallbackMessage = 'No se pudo analizar con IA.',
  context = 'gemini'
): Error {
  const status = geminiErrorStatus(error);
  const message = geminiErrorMessage(error, fallbackMessage);
  console.error(`[${context}] Gemini status=${status ?? 'desconocido'} message=${message}`);

  if (message.includes('high demand')) {
    return new Error('Gemini está con alta demanda en este momento. Intenta nuevamente en unos minutos.');
  }
  return new Error(message);
}

export async function analyzePhotosWithGemini(preperitaje: any, fotos: any[]): Promise<AnalisisFotosIA> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el backend.');
  }
  if (fotos.length === 0) {
    throw new ControlledGeminiError('Sube al menos una foto antes de analizar.', 400);
  }

  const fotosDisponibles = fotos.filter((foto) => isImageAvailable(foto?.filename));
  if (fotosDisponibles.length === 0) {
    throw new ControlledGeminiError(
      'Las fotografías del preperitaje no están disponibles en el servidor; vuelve a subirlas e intenta de nuevo.',
      400
    );
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const zonasFotografiadas = fotosDisponibles
    .map((foto) => `- ${ZONE_LABELS[foto.zona] || foto.zona}`)
    .join('\n');

  let respuestas = preperitaje.respuestas;
  if (typeof respuestas === 'string') {
    try {
      respuestas = JSON.parse(respuestas);
    } catch {
      respuestas = null;
    }
  }
  const respuestasParaIA = Array.isArray(respuestas)
    ? respuestas.map((parte: any) => ({
        ...parte,
        condicionEtiqueta: conditionLabel(parte?.id, parte?.condition),
      }))
    : respuestas;

  const datosVehiculo = JSON.stringify({
    placa: preperitaje.placa || '',
    marca: preperitaje.marca || '',
    linea: preperitaje.linea || '',
    anio: preperitaje.anio ?? null,
    kilometraje: preperitaje.kilometraje ?? null,
    color: preperitaje.color || '',
    combustible: preperitaje.combustible || '',
    transmision: preperitaje.transmision || '',
    respuestasCuestionario: respuestasParaIA ?? null,
  });

  const prompt = `Eres un perito automotriz que hace una valoración preliminar orientativa. Analiza únicamente lo que se observa en las fotografías adjuntas y en los datos del vehículo. No inventes daños ni datos que no estén visibles.

Datos del vehículo:
${datosVehiculo}

Zonas fotografiadas:
${zonasFotografiadas}

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{
  "estado_general": "Resumen breve del estado visual del vehículo",
  "hallazgos": [
    { "zona": "frontal", "titulo": "Hallazgo breve", "detalle": "Qué se observa en la foto", "severidad": "baja|media|alta" }
  ],
  "recomendaciones": ["Recomendación concreta 1", "Recomendación concreta 2"],
  "valoracion": {
    "min": 0,
    "max": 0,
    "moneda": "COP",
    "factores": ["Factor que influyó en el rango"]
  }
}

La valoración debe ser un rango estimado en pesos colombianos (COP), considerando marca, modelo, año, kilometraje y el estado visible. Usa números sin símbolos ni puntos de miles. Si no hay información suficiente para estimar, usa 0 y explica el motivo en "factores". Incluye en "estado_general" la advertencia de que el resultado es orientativo y no reemplaza un peritaje profesional.`;

  const parts: any[] = [{ text: prompt }];
  let fotosIncluidas = 0;

  for (const foto of fotosDisponibles) {
    try {
      const bytes = await readImageBytes(foto.filename);
      parts.push({
        inlineData: {
          mimeType: foto.mime_type || 'image/jpeg',
          data: bytes.toString('base64'),
        },
      });
      fotosIncluidas += 1;
    } catch (e: any) {
      console.error(`[analizar-fotos] Foto ${foto?.id || 'sin-id'} omitida: ${e?.message || String(e)}`);
    }
  }

  if (fotosIncluidas === 0) {
    throw new ControlledGeminiError(
      'Las fotografías del preperitaje no están disponibles en el servidor; vuelve a subirlas e intenta de nuevo.',
      400
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  let response: any;
  try {
    response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });
  } catch (e) {
    throw friendlyGeminiError(e, 'No se pudo analizar las fotos con IA.', 'analizar-fotos');
  }

  const parsed = AnalisisSchema.parse(parseJson(extractText(response)));
  const min = Math.max(0, Math.round(parsed.valoracion.min));
  const max = Math.max(min, Math.round(parsed.valoracion.max));

  return {
    ...parsed,
    valoracion: {
      ...parsed.valoracion,
      min,
      max,
      moneda: parsed.valoracion.moneda || 'COP',
      factores: parsed.valoracion.factores || [],
    },
    generadoEn: new Date().toISOString(),
    modelo: model,
    fotosAnalizadas: fotosIncluidas,
    aviso: 'Resultado orientativo generado por IA; no reemplaza un peritaje profesional.',
  };
}
