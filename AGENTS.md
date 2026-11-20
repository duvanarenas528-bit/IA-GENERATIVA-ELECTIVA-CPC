# AGENTS.md — reglas globales de AutoCheck

Este archivo define las reglas obligatorias para cualquier agente de IA que trabaje en el repositorio `PREPERITAJE-VEHICULAR` (AutoCheck). Aplica a todo el árbol del proyecto.

---

## 1. Stack y topología del proyecto

### Frontend

- Ubicación: `frontend/`.
- Stack: React 19, TypeScript, Vite 8, Tailwind CSS.
- Despliegue: Vercel.
- Vercel reenvía `/api/:path*` al backend de Render mediante `frontend/vercel.json`.
- El frontend nunca debe contener secretos, claves privadas ni variables con prefijo `VITE_` que expongan credenciales.

### Backend

- Ubicación: `backend/`.
- Stack: Node.js, Express 4, TypeScript.
- Despliegue: Render.
- Separación obligatoria:
  - `routes/`: solo definición de endpoints y middlewares de ruta.
  - `controllers/`: orquestación HTTP, validación de entrada y respuestas.
  - `services/`: lógica de negocio, integraciones y reglas reutilizables.
  - `middlewares/`: autenticación, subida de archivos, validaciones y manejo de errores.

### Datos

- PostgreSQL de Supabase.
- Migraciones SQL: `backend/src/db/migrations/`.
- Redis de Upstash configurado en `backend/src/config/redis.ts`.
- Las migraciones deben ser idempotentes y no destructivas salvo autorización explícita.

### IA

- SDK: `@google/genai`.
- Modelo por defecto: `gemini-3.8-flash`.
- Servicios principales:
  - `backend/src/services/photoAnalysisService.ts`
  - `backend/src/services/questionnaireAnalysisService.ts`
- Salida esperada: JSON estructurado y validado.
- Toda respuesta de IA es orientativa y debe indicar que no sustituye un peritaje profesional.

---

## 2. Seguridad estricta

### Prohibiciones absolutas

- No leer archivos `.env` reales.
- No imprimir, copiar, resumir ni pegar en logs el contenido de archivos `.env`.
- No hardcodear secretos en código, tests, documentación ni mensajes de commit.
- No exponer secretos en el frontend.
- No usar prefijo `VITE_` para claves privadas. Todo `VITE_*` viaja al bundle público.

Nombres sensibles que nunca deben aparecer en diffs ni respuestas:

- `GEMINI_API_KEY`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_*`
- `SUPABASE_SERVICE_ROLE_KEY`
- Upstash tokens
- claves privadas, certificados o cookies de sesión

### Reglas de configuración

- Usar `.env.example` para documentar nombres de variables, nunca valores reales.
- Si una configuración necesita un secreto, referenciarlo por nombre de variable de entorno.
- En `opencode.json`, los secretos se resuelven con interpolación `{env:NOMBRE}`. Nunca pegar el valor.
- En MCPs locales, pasar secretos como argumento interpolado o variable de entorno del proceso, nunca como literal.
- No ejecutar comandos que vuelquen variables de entorno completas (`env`, `printenv`, `set`) en la conversación.

### Autenticación y autorización

- Las rutas privadas deben usar el middleware de autenticación correspondiente.
- Toda consulta o mutación de recursos del usuario debe validar propiedad por `user_id`.
- El rol `admin` solo debe permitirse donde exista una comprobación explícita en backend.
- Nunca confiar en un `user_id` enviado por el frontend como prueba de propiedad.

---

## 3. Arquitectura y convenciones

### Backend

- Mantener `routes/`, `controllers/`, `services/` y `middlewares/` estrictamente separados.
- Los controladores no deben contener lógica de negocio extensa ni prompts de IA.
- Los servicios no deben conocer detalles de `req` / `res`.
- Validar y normalizar entradas antes de tocar base de datos o servicios externos.
- Usar errores controlados con códigos HTTP coherentes:
  - `400`: entrada inválida o archivos no disponibles.
  - `401`: sesión ausente, inválida o expirada.
  - `404`: recurso inexistente o no propiedad del usuario.
  - `502`: fallo de proveedor externo.
- Nunca devolver stack traces ni mensajes crudos de proveedores al cliente.

### Frontend

- Consumir la API desde `frontend/src/services/api.ts`.
- Toda petición autenticada debe usar `credentials: 'include'`.
- Manejar renovación de sesión con `POST /api/auth/refresh` y reintentar una sola vez tras `401`.
- No inventar estados, datos ni respuestas de API para simular éxito.
- No ocultar errores de red sin mensaje visible para el usuario.

### Servicios externos

- Gemini, API Ninjas y cualquier integración externa deben degradar de forma controlada.
- Si falla un proveedor, devolver un error claro y no tumbar el proceso.
- Registrar el estado HTTP y el mensaje real del proveedor en logs de servidor, sin secretos.
- Las respuestas de IA deben validarse antes de guardarse o mostrarse.

### Base de datos

- Preferir columnas `JSONB` para estructuras dinámicas como `respuestas` o metadatos.
- Serializar objetos y arrays con `JSON.stringify` antes de enviarlos a columnas `JSONB`.
- Usar llaves foráneas con integridad referencial.
- Indexar claves foráneas y columnas de filtrado frecuente con índices B-Tree.
- Toda migración nueva debe poder ejecutarse sin romper migraciones previas.

---

## 4. Definición de tarea completada

Antes de finalizar **cualquier cambio de código**, ejecutar y verificar:

```bash
cd backend && npm run build
```

```bash
cd frontend && npm run build && npm run lint
```

También se debe verificar:

- No existen secretos en el diff.
- No se modificaron archivos `.env` reales.
- No hay errores de TypeScript.
- No hay errores de lint.
- Los endpoints cambiados están sincronizados entre backend y `frontend/src/services/api.ts`.
- Si se creó una migración, es idempotente.

Si alguno de estos comandos falla, la tarea no está completada.

---

## 5. Prioridades al resolver ambigüedades

1. Seguridad del repositorio y de credenciales.
2. Contratos API coherentes entre frontend y backend.
3. Integridad de datos y migraciones seguras.
4. Degradación controlada de dependencias externas.
5. Claridad y mantenibilidad del código.
6. Conservar la estructura visual existente salvo petición explícita.

---

## 6. Skills obligatorias según el tipo de tarea

- Migraciones SQL: usar `db-migrations`.
- Cambios de endpoints o API client: usar `api-contract-sync`.
- Integraciones o cambios con Gemini: usar `genai-resilience`.
- Antes de commit o cierre de tarea: usar `verify-and-audit`.
