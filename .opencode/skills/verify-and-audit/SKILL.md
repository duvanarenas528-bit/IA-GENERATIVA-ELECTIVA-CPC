---
name: verify-and-audit
description: Run the mandatory pre-commit verification and security audit for AutoCheck. Use before committing or declaring any code task complete, including builds, lint, unused dependencies and secret exposure checks.
---

# Verificación y auditoría obligatoria

Usa esta skill antes de hacer commit, crear PR o declarar completa cualquier tarea de código en AutoCheck.

## 1. Compilación y lint

Ejecutar siempre:

```bash
cd backend && npm run build
```

```bash
cd frontend && npm run build && npm run lint
```

Si alguno falla, la tarea no está terminada. No omitir lint aunque el build pase.

También ejecutar cuando haya cambios preparados:

```bash
git diff --check
git status --short
```

## 2. Secretos

Nunca leer ni imprimir archivos `.env` reales.

Revisar solo el diff preparado o la working tree, buscando nombres sensibles:

```bash
git diff --cached -- . ':(exclude)*.env' | rg 'GEMINI_API_KEY|DATABASE_URL|REDIS_URL|JWT_|SUPABASE_SERVICE_ROLE_KEY|sk-|gho_|ghp_|-----BEGIN'
git diff -- . ':(exclude)*.env' | rg 'GEMINI_API_KEY|DATABASE_URL|REDIS_URL|JWT_|SUPABASE_SERVICE_ROLE_KEY|sk-|gho_|ghp_|-----BEGIN'
```

Verificar además:

- No se agregó ningún archivo `.env` real.
- No hay secretos en frontend.
- No hay variables `VITE_*` que contengan claves privadas.
- No se imprimieron variables de entorno completas.
- No hay tokens en mensajes de commit, tests ni documentación.
- Los logs nuevos no imprimen request bodies con credenciales.

## 3. Dependencias

- Toda dependencia nueva debe estar justificada por un import real.
- No agregar librerías “por si acaso”.
- Revisar que `package.json` y lockfiles queden sincronizados.
- Buscar imports huérfanos con `rg` antes de eliminar dependencias.
- Si `npm audit` reporta problemas, documentar si se aplica fix o por qué no es seguro aplicarlo.

Comandos útiles:

```bash
npm --prefix backend ls --depth=0
npm --prefix frontend ls --depth=0
npm --prefix backend audit --omit=dev
npm --prefix frontend audit --omit=dev
```

## 4. Contratos y datos

- Cambios de endpoints: aplicar skill `api-contract-sync`.
- Cambios de migraciones: aplicar skill `db-migrations` y confirmar idempotencia.
- Cambios de Gemini: aplicar skill `genai-resilience`.
- Confirmar que `frontend/src/services/api.ts` y `backend/src/routes/` siguen alineados.
- Confirmar que no se inventaron datos en respuestas de IA ni en UI.

## 5. Calidad general

- No hay `console.log` de debugging temporal.
- Los errores tienen mensaje visible para el usuario.
- Las rutas privadas validan propiedad por `user_id` o rol `admin` explícito.
- No se devuelven stack traces al cliente.
- El diff contiene solo cambios intencionados.
- No se modificaron archivos generados salvo que sea necesario.

## 6. Reporte final

Antes de cerrar la tarea, reportar:

- Comandos ejecutados y resultado de cada uno.
- Archivos principales cambiados.
- Verificación de secretos.
- Cualquier advertencia relevante, por ejemplo vulnerabilidades no corregidas o pasos pendientes de deploy.
