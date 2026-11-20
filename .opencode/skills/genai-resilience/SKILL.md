---
name: genai-resilience
description: Harden Gemini integrations in photoAnalysisService.ts and questionnaireAnalysisService.ts for AutoCheck. Use when changing @google/genai prompts, JSON output validation, API error logging or legal disclaimers.
---

# Resiliencia con Gemini

Usa esta skill para cualquier cambio en:

- `backend/src/services/photoAnalysisService.ts`
- `backend/src/services/questionnaireAnalysisService.ts`
- `backend/src/services/gemini.ts`
- Prompts, esquemas JSON o mapeo de errores de IA.

## Reglas generales

1. SDK: `@google/genai`.
2. Modelo por defecto: `gemini-3.8-flash`. La variable `GEMINI_MODEL` puede overridearlo, pero el fallback en código debe ser `gemini-3.8-flash`.
3. Nunca hardcodear `GEMINI_API_KEY`. Leerlo solo desde configuración del backend.
4. La salida esperada siempre es JSON estructurado. Usar `responseMimeType: 'application/json'` y `responseSchema` cuando el SDK lo permita; además validar el payload recibido antes de guardarlo o enviarlo al frontend.
5. No inventar hallazgos, precios, rangos de mercado ni puntajes que no se deriven de datos reales del preperitaje.
6. Toda respuesta debe incluir o acompañarse de la advertencia: “Este diagnóstico es orientativo y no sustituye un peritaje profesional.”

## Validación antes de consumir cuota

Antes de llamar a Gemini:

- Verificar que exista el preperitaje y pertenezca al usuario autenticado.
- Verificar que haya fotos disponibles y legibles.
- Omitir fotos no disponibles con un log controlado.
- Si no queda ninguna foto válida, lanzar un error controlado con estado `400` y mensaje:
  `Las fotografías del preperitaje no están disponibles en el servidor; vuelve a subirlas e intenta de nuevo`.
- Validar que las respuestas obligatorias del cuestionario estén presentes.
- No reintentar automáticamente errores causados por entradas inválidas.

El objetivo es no gastar cuota de API cuando la petición ya es inválida.

## Manejo de errores del proveedor

- Capturar el error real de Gemini sin incluir API keys ni prompts con datos sensibles.
- Registrar en logs de servidor:
  - contexto (`analizar-fotos`, `analizar-cuestionario`),
  - status HTTP devuelto por el proveedor,
  - mensaje real del proveedor.
- Ejemplo de forma esperada:

```ts
console.error(
  `[analizar-fotos] Gemini status=${status ?? 'desconocido'} message=${message}`,
);
```

- Al cliente nunca devolver el mensaje crudo del proveedor:
  - `400`: entrada inválida o archivos no disponibles.
  - `502`: fallo de Gemini u otro proveedor externo.
- Si el proveedor falla, la aplicación debe degradar de forma controlada y seguir viva.

## Validación de JSON

Después de recibir la respuesta:

1. Hacer `JSON.parse` de forma segura.
2. Comprobar tipo raíz, campos obligatorios y tipos de cada campo.
3. Normalizar arrays vacíos y valores `null`.
4. Descartar cualquier campo inesperado que no deba persistirse.
5. Solo entonces guardar en base de datos o enviar al frontend.

Si el JSON no cumple el contrato, tratarlo como fallo controlado del proveedor, no como éxito.

## Checklist

- Modelo fallback `gemini-3.8-flash`.
- Sin secretos en prompts, logs ni respuestas.
- Entradas validadas antes de la llamada.
- Fotos faltantes gestionadas con error `400` controlado.
- Errores de API logueados con status y mensaje real, sin secretos.
- Cliente recibe mensaje genérico y seguro.
- JSON validado antes de persistir o mostrar.
- Advertencia legal presente.
- `cd backend && npm run build` pasa.
