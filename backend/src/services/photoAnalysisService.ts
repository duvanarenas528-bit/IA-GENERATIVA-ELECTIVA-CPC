import fs from 'fs/promises';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { UPLOADS_DIR } from '../middlewares/upload.js';
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

export function friendlyGeminiError(error: any, fallbackMessage = 'No se pudo analizar con IA.'): Error {
  let message = error?.message || fallbackMessage;
  try {
    const parsed = JSON.parse(message);
    if (parsed?.error?.message) message = parsed.error.message;
  } catch {}
  if (message.includes('high demand')) {
    message = 'Gemini está con alta demanda en este momento. Intenta nuevamente en unos minutos.';
  }
  return new Error(message);
}

export async function analyzePhotosWithGemini(preperitaje: any, fotos: any[]): Promise<AnalisisFotosIA> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el backend.');
  }
  if (fotos.length === 0) {
    throw new Error('Sube al menos una foto antes de analizar.');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const zonasFotografiadas = fotos
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
  for (const foto of fotos) {
    const bytes = await fs.readFile(path.join(UPLOADS_DIR, path.basename(foto.filename)));
    parts.push({
      inlineData: {
        mimeType: foto.mime_type || 'image/jpeg',
        data: bytes.toString('base64'),
      },
    });
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
    throw friendlyGeminiError(e, 'No se pudo analizar las fotos con IA.');
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
    fotosAnalizadas: fotos.length,
    aviso: 'Resultado orientativo generado por IA; no reemplaza un peritaje profesional.',
  };
}
