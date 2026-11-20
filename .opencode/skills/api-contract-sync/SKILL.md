---
name: api-contract-sync
description: Keep backend routes in backend/src/routes/ synchronized with frontend/src/services/api.ts for AutoCheck. Use when adding or changing endpoints, auth cookies, refresh flows or HTTP error handling.
---

# Sincronización de contrato API

Usa esta skill cuando se modifique un endpoint en `backend/src/routes/` o su llamada en `frontend/src/services/api.ts`.

## Flujo obligatorio

1. Leer la definición real de la ruta en `backend/src/routes/` y el controlador que invoca.
2. Confirmar método, ruta completa con prefijo `/api`, middlewares de autenticación y forma del cuerpo/respuesta.
3. Replicar el contrato en `frontend/src/services/api.ts`. No crear clients paralelos en componentes.
4. Usar siempre `credentials: 'include'` en peticiones autenticadas.
5. No guardar tokens de acceso en `localStorage`, `sessionStorage` ni variables globales. AutoCheck usa cookies `httpOnly`.
6. Enviar `Content-Type: application/json` solo cuando el cuerpo sea JSON. Para `FormData`, dejar que el navegador establezca el `Content-Type` con el boundary correcto.
7. Definir tipos TypeScript para request y response. Si el backend cambia un campo, actualizar el tipo en el mismo cambio.
8. Verificar que Vercel siga reenviando `/api/:path*` al backend de Render mediante `frontend/vercel.json`.

## Renovación de sesión

Toda petición autenticada debe seguir este patrón:

1. Ejecutar la petición con `credentials: 'include'`.
2. Si responde `401`, llamar exactamente una vez a `POST /api/auth/refresh`.
3. Si el refresh es exitoso, reintentar la petición original una sola vez.
4. Si el refresh falla o el reintento vuelve a `401`, limpiar el estado de usuario y mostrar un mensaje visible de sesión expirada.
5. Nunca reintentar en bucle.

## Mapeo de estados HTTP

| Estado | Significado | Acción frontend |
|---|---|---|
| `400` | Entrada inválida o archivo no disponible | Mostrar mensaje de validación devuelto por el backend |
| `401` | Sesión ausente, inválida o expirada | Refrescar una vez y reintentar; si falla, cerrar sesión |
| `404` | Recurso inexistente o no propiedad del usuario | Mostrar “no encontrado” o “sin acceso”, sin exponer datos |
| `502` | Fallo de proveedor externo | Mostrar mensaje controlado: no es posible completar la operación en este momento |
| `5xx` | Fallo inesperado | Mostrar mensaje genérico y registrar el error en consola sin secretos |

Nunca mostrar stack traces ni mensajes crudos de Gemini, PostgreSQL o Redis.

## Plantilla de cliente

```ts
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: 'include',
  });

  if (response.status === 401 && retry && !path.startsWith('/auth/refresh')) {
    const refreshed = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshed.ok) {
      return apiFetch<T>(path, init, false);
    }
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? 'No fue posible completar la solicitud.');
  }

  return payload as T;
}
```

Ajustar la plantilla a los helpers existentes de `api.ts`; no duplicar lógica si ya existe un wrapper.

## Checklist

- Método y ruta idénticos en backend y frontend.
- Middleware `requireAuth` presente en rutas privadas.
- Propiedad del recurso validada por `user_id` en backend.
- `credentials: 'include'` en todas las llamadas autenticadas.
- Refresh en `POST /api/auth/refresh` con un solo reintento.
- Errores `400`, `401`, `404`, `502` mapeados a mensajes visibles.
- Tipos TypeScript alineados.
- Probado con Playwright o DevTools: request, cookies y response.
- `cd frontend && npm run build && npm run lint` pasa.
- `cd backend && npm run build` pasa si cambió el backend.
