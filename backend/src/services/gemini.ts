import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const ReportSchema = z.object({
  estado_general: z.string().optional(),
  hallazgos: z.array(z.any()).optional(),
  riesgos: z.array(z.any()).optional(),
  recomendaciones: z.array(z.any()).optional(),
  diagnostico_preliminar: z.string().optional(),
});

export async function generatePreperitajeReport(vehicle: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    return {
      contenido: {
        estado_general: 'Sin IA (ejemplo)',
        hallazgos: [
          { titulo: 'Revisión visual pendiente', detalle: 'Falta inspección física detallada.' },
        ],
        riesgos: [
          { nivel: 'medio', descripcion: 'Requiere verificación en taller.' },
        ],
        recomendaciones: [
          'Realizar inspección mecánica completa.',
          'Verificar documentación del vehículo.',
        ],
        diagnostico_preliminar: 'Diagnóstico preliminar generado por IA; no reemplaza una revisión mecánica profesional.',
        fuente: 'ejemplo_sin_clave',
      },
      resumen: 'Informe simulado - sin clave GEMINI_API_KEY',
      esSimulado: true,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Genera un informe de preperitaje vehicular en JSON con las claves estado_general, hallazgos, riesgos, recomendaciones, diagnostico_preliminar.
Datos del vehículo:
Placa: ${vehicle.placa || ''}
Marca: ${vehicle.marca || ''}
Modelo: ${vehicle.modelo || ''}
Año: ${vehicle.anio || ''}
Kilometraje: ${vehicle.kilometraje || ''}
Color: ${vehicle.color || ''}
Observaciones: ${vehicle.observaciones || ''}

Responde ÚNICAMENTE con JSON válido.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = (response as any).text || (response as any).candidates?.[0]?.content?.parts?.[0]?.text || '';
    let parsed: any = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      // try to extract json
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    const validated = ReportSchema.partial().parse(parsed);
    if (!validated.diagnostico_preliminar) {
      validated.diagnostico_preliminar = 'Diagnóstico preliminar generado por IA; no reemplaza una revisión mecánica profesional.';
    }

    return {
      contenido: validated,
      resumen: validated.estado_general || 'Informe generado por IA',
      esSimulado: false,
    };
  } catch (e) {
    console.error('Gemini error:', e);
    return {
      contenido: {
        estado_general: 'Sin IA (ejemplo por error)',
        hallazgos: [
          { titulo: 'Error al generar con IA', detalle: 'Se muestra informe de ejemplo.' },
        ],
        riesgos: [
          { nivel: 'medio', descripcion: 'Verificar con revisión presencial.' },
        ],
        recomendaciones: [
          'Intentar nuevamente más tarde.',
          'Realizar inspección mecánica profesional.',
        ],
        diagnostico_preliminar: 'Diagnóstico preliminar generado por IA; no reemplaza una revisión mecánica profesional.',
        fuente: 'ejemplo_por_error',
      },
      resumen: 'Informe simulado - error Gemini',
      esSimulado: true,
    };
  }
}
