import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { friendlyGeminiError } from './photoAnalysisService.js';
import { conditionLabel } from './questionnaireCatalog.js';

const AnalisisCuestionarioSchema = z.object({
  resumen: z.string().min(1),
  comentarios: z
    .array(
      z.object({
        parte: z.string().min(1),
        comentario: z.string().min(1),
        explicacion: z.string().min(1),
        orientacion: z.string().min(1),
        prioridad: z.enum(['baja', 'media', 'alta']).default('media'),
      })
    )
    .default([]),
  recomendaciones_generales: z.array(z.string()).default([]),
  preguntas_sugeridas: z.array(z.string()).default([]),
});

export type AnalisisCuestionarioIA = z.infer<typeof AnalisisCuestionarioSchema> & {
  generadoEn: string;
  modelo: string;
  comentariosAnalizados: number;
  aviso: string;
};

export interface ComentarioCuestionario {
  parte: string;
  comentario: string;
  condicion: string;
}

function parseJson(value: unknown): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

export function extraerComentariosCuestionario(respuestas: unknown): ComentarioCuestionario[] {
  const parsed = parseJson(respuestas);
  const items: any[] = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object'
      ? Object.values(parsed)
      : [];

  return items
    .filter((item) => !!item && typeof item === 'object')
    .map((item) => ({
      id: String(item.id || '').trim(),
      parte: String(item.name || item.nombre || item.parte || 'Parte del vehículo').trim(),
      comentario: String(item.userObservations || item.observaciones || item.comentario || '').trim(),
      condicion: String(item.condition || item.condicion || '').trim(),
    }))
    .filter((item) => item.comentario.length > 0)
    .map(({ id, ...item }) => ({
      ...item,
      condicion: conditionLabel(id, item.condicion),
    }));
}

function extractText(response: any): string {
  return (
    response?.text ||
    response?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || '').join('') ||
    ''
  );
}

function parseGeminiJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Gemini no devolvió un JSON válido.');
    return JSON.parse(match[0]);
  }
}

export async function analizarCuestionarioConGemini(preperitaje: any): Promise<AnalisisCuestionarioIA> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el backend.');
  }

  const comentarios = extraerComentariosCuestionario(preperitaje.respuestas);
  if (comentarios.length === 0) {
    throw new Error('El cuestionario no tiene comentarios escritos para analizar.');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const datos = JSON.stringify(
    {
      vehiculo: {
        placa: preperitaje.placa || '',
        marca: preperitaje.marca || '',
        linea: preperitaje.linea || '',
        anio: preperitaje.anio ?? null,
        kilometraje: preperitaje.kilometraje ?? null,
      },
      comentarios,
    },
    null,
    2
  );

  const prompt = `Eres un perito automotriz y un comunicador claro para personas que no son técnicas. El usuario registró estos comentarios al responder un cuestionario de inspección de un vehículo.

Analiza SOLO el texto de los comentarios y la condición que el usuario marcó. No inventes daños, no afirmes que viste fotos y no cambies el sentido de lo que escribió. Tu objetivo es explicar y orientar, no dictaminar.

Datos y comentarios:
${datos}

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{
  "resumen": "Resumen claro de lo que el usuario reportó y qué significa en conjunto",
  "comentarios": [
    {
      "parte": "Nombre de la parte reportada",
      "comentario": "Copia textual del comentario del usuario",
      "explicacion": "Explicación sencilla de qué significa ese comentario y por qué importa",
      "orientacion": "Qué revisar, preguntar o hacer a continuación de forma concreta",
      "prioridad": "baja|media|alta"
    }
  ],
  "recomendaciones_generales": ["Acción concreta 1", "Acción concreta 2"],
  "preguntas_sugeridas": ["Pregunta que debería hacerle al vendedor o al taller 1", "Pregunta 2"]
}

Usa un tono respetuoso y práctico. Prioridad alta solo cuando el comentario sugiera un riesgo de seguridad, daño estructural o falla mecánica importante. Prioridad media para desgaste o reparaciones pendientes. Prioridad baja para observaciones estéticas o informativas. Incluye en "resumen" que la orientación es preliminar y no reemplaza una inspección profesional.`;

  const ai = new GoogleGenAI({ apiKey });
  let response: any;
  try {
    response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.25,
      },
    });
  } catch (e) {
    throw friendlyGeminiError(e, 'No se pudo analizar el cuestionario con IA.', 'analizar-cuestionario');
  }

  const parsed = AnalisisCuestionarioSchema.parse(parseGeminiJson(extractText(response)));

  return {
    ...parsed,
    generadoEn: new Date().toISOString(),
    modelo: model,
    comentariosAnalizados: comentarios.length,
    aviso: 'Orientación generada por IA a partir de los comentarios del cuestionario; no reemplaza una inspección profesional.',
  };
}
