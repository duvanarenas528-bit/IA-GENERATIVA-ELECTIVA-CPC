# Brief para Claude: Informe Técnico del Proyecto AutoCheck

Copia y entrega **todo este contenido** a Claude junto con acceso al repositorio. Si Claude tiene acceso directo al repo, pídele que lo inspeccione antes de redactar. Si no, incluye este archivo como contexto.

---

## 1. Rol y objetivo

Actúa como un ingeniero de software senior y redactor técnico académico.

Tu tarea es generar un **informe técnico completo** del proyecto **AutoCheck — Preperitaje Vehicular con Inteligencia Artificial**, a partir del código fuente y de la información de este brief.

El informe debe explicar **qué es el sistema, cómo está construido, cómo funciona, cómo se despliega, qué decisiones técnicas se tomaron, qué riesgos existen y qué recomendaciones se derivan**.

No redactes un simple resumen ejecutivo. El entregable debe ser un documento técnico formal, suficiente para una sustentación académica o una entrega de proyecto de ingeniería.

---

## 2. Datos generales del proyecto

- **Nombre del proyecto:** AutoCheck — Preperitaje Vehicular con Inteligencia Artificial.
- **Institución:** Corporación Universitaria Minuto de Dios — UNIMINUTO.
- **Programa:** Ingeniería de Sistemas.
- **Asignatura:** Electiva CPC / IA Generativa.
- **Integrantes:** Duban Tibaquira, Leni Santiago Murillo.
- **Tutor:** Esteban.
- **Ciudad:** Ibagué.
- **Fecha original del proyecto:** 05/10/2026.
- **Estado actual:** sistema implementado, migraciones aplicadas en Supabase y despliegue previsto/ejecutado en Render + Vercel.

Redacta en **español formal**, con tono académico-técnico.

---

## 3. Instrucciones críticas antes de escribir

1. Inspecciona el repositorio antes de redactar. Prioriza estas fuentes:
   - `README.md`
   - `backend/src/index.ts`
   - `backend/src/routes/*.ts`
   - `backend/src/controllers/*.ts`
   - `backend/src/services/*.ts`
   - `backend/src/db/migrate.ts`
   - `backend/src/db/migrations/*.sql`
   - `backend/src/config/redis.ts`
   - `backend/src/middlewares/upload.ts`
   - `frontend/src/screens/*.tsx`
   - `frontend/src/constants/questionnaire.ts`
   - `frontend/src/services/api.ts`
   - `frontend/vercel.json`
   - `docker-compose.yml`
   - `.env.example` y `frontend/.env.example` **solo como plantillas**
   - `mi-framework-ia/docs/proyecto/*.md`

2. **No leas, copies ni menciones archivos `.env` reales.** Ellos contienen secretos.
3. **No incluyas contraseñas, tokens, claves API, correos personales ni hosts privados.**
4. Si encuentras datos de demostración o métricas simuladas en pantallas administrativas, indícalos explícitamente como **ilustrativos**, no como resultados reales.
5. Si algo no está claro en el código, escríbelo como **“requiere validación”** o **“no implementado en la versión actual”**. No lo inventes.
6. Diferencia claramente entre:
   - funcionalidad implementada;
   - funcionalidad desplegada;
   - funcionalidad planeada;
   - limitación conocida.

---

## 4. Contexto técnico que debe reflejarse

### 4.1 Propósito

AutoCheck permite a un propietario:

1. Registrar un vehículo.
2. Responder un cuestionario técnico de 8 partes.
3. Registrar historial de mantenimiento.
4. Cargar fotografías por zonas.
5. Obtener un informe preliminar con reglas e IA.
6. Revisar un certificado A4 imprimible.
7. Compartir una ficha de venta.
8. Transferir el preperitaje a otro usuario existente conservando historial, fotos y mantenimiento.

El sistema debe dejar claro que sus resultados son **orientativos** y que **no reemplazan un peritaje profesional**.

### 4.2 Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS |
| Backend | Node.js, Express 4, TypeScript |
| Base de datos | PostgreSQL / Supabase |
| Caché y sesiones | Redis / Upstash, cliente `ioredis` |
| IA | Gemini, modelo `gemini-3.8-flash`, SDK `@google/genai` |
| Catálogo vehicular | API Ninjas Cars, caché Redis y fallback local |
| Autenticación | JWT en cookies httpOnly + refresh token en Redis |
| Archivos | Multer en memoria + Supabase Storage (`autocheck-uploads`); fallback local solo para archivos antiguos |
| Despliegue | Render para backend, Vercel para frontend |
| Proxy frontend | `frontend/vercel.json` reenvía `/api/:path*` al backend de Render |

### 4.3 Arquitectura actual

El navegador carga el frontend desde Vercel. Las peticiones a `/api` son manejadas por un rewrite de Vercel y enviadas al backend en Render. Esto hace que el navegador vea el API como mismo origen, evitando CORS y cookies de terceros.

El backend se conecta a:

- PostgreSQL en Supabase mediante `DATABASE_URL`.
- Redis en Upstash mediante `REDIS_URL`.
- Gemini mediante `GEMINI_API_KEY`.
- API Ninjas mediante `API_NINJAS_KEY`.

En Render debe usarse una cadena PostgreSQL con SSL compatible, por ejemplo con `uselibpqcompat=true&sslmode=require` si aparece `SELF_SIGNED_CERT_IN_CHAIN`.

### 4.4 Módulos backend

Describe al menos estos módulos:

- `routes/auth.ts`: registro, login, logout, refresh, recuperación, avatar.
- `routes/vehicles.ts`: vehículos, preperitajes y métricas del panel.
- `routes/preperitajes.ts`: informe, fotos, análisis de fotos, análisis del cuestionario y traspaso.
- `routes/catalog.ts`: marcas, modelos y años.
- `routes/users.ts`: métricas del perfil.
- `routes/admin.ts`: vista administrativa.
- `services/photoAnalysisService.ts`: análisis visual con Gemini.
- `services/questionnaireAnalysisService.ts`: análisis de comentarios del cuestionario.
- `services/preperitajeReport.ts`: construcción del informe, hallazgos y mantenimiento.
- `services/carCatalogService.ts`: consumo de API Ninjas, caché y fallback.
- `services/passwordResetService.ts`: códigos de recuperación en Redis.
- `db/migrate.ts`: ejecución de migraciones SQL.
- `middlewares/upload.ts`: Multer en memoria, filtros y límites de imágenes.
- `utils/supabase.ts`: cliente Supabase y constante `STORAGE_BUCKET`.
- `utils/storage.ts`: subida, eliminación y lectura de imágenes en Supabase Storage.

### 4.5 Módulos frontend

Describe al menos estas pantallas:

- `NuevoPreperitajeScreen.tsx`: datos del vehículo, mantenimiento, cuestionario y fotos.
- `InformeDetalladoScreen.tsx`: informe completo, IA visual, IA de comentarios y mantenimiento.
- `FichaVentaScreen.tsx`: ficha para comprador y traspaso.
- `VisorA4Screen.tsx`: certificado/imprimible.
- `PerfilScreen.tsx`: métricas e historial.
- `LoginScreen.tsx`: login, registro y recuperación.
- `GuiaInspeccionScreen.tsx`: guía de buenas prácticas de fotografía e inspección.
- `constants/questionnaire.ts`: opciones, severidades y guías de inspección por parte.
- `services/api.ts`: cliente HTTP con `VITE_API_URL`.

### 4.6 Base de datos

Las migraciones van de `001` a `010`.

Tablas principales en `public`:

- `users`
- `vehicles`
- `reports`
- `preperitajes`
- `preperitaje_fotos`

Columnas relevantes agregadas por migraciones posteriores:

- avatares de usuario.
- rol de usuario.
- análisis IA visual.
- transferencia entre propietarios.
- análisis IA del cuestionario.
- historial de mantenimiento en JSONB.

No existe tabla de control de migraciones: el runner ejecuta todos los `.sql` y la idempotencia depende de `IF NOT EXISTS`.

### 4.7 Cuestionario

Las 8 partes son:

1. Lateral derecho.
2. Lateral izquierdo.
3. Frente y capó.
4. Parte trasera y maletero.
5. Techo y cristales.
6. Compartimiento del motor.
7. Llantas y rines.
8. Interior y odómetro.

Cada parte incluye ahora una guía visible de “Cómo inspeccionar esta parte”, dirigida a usuarios sin experiencia técnica.

Las opciones cambian por sección y tienen severidad:

- `optima`
- `baja`
- `media`
- `alta`

### 4.8 Mantenimiento

El cuestionario registra:

- última fecha de cambio de aceite;
- kilometraje del cambio;
- taller del cambio;
- fecha del último mantenimiento;
- taller del último mantenimiento;
- descripción de lo realizado.

El informe calcula:

- kilómetros desde el cambio de aceite;
- referencia aproximada de próximo cambio a los 5.000 km.

Aclara que es una referencia, no una recomendación del fabricante.

### 4.9 Inteligencia Artificial

Existen dos análisis IA independientes:

1. **Análisis visual:** usa fotos, datos del vehículo y respuestas; devuelve estado general, hallazgos, recomendaciones y rango estimado.
2. **Análisis de comentarios:** usa observaciones abiertas del cuestionario; devuelve resumen, explicación por comentario, prioridad, recomendaciones generales y preguntas sugeridas.

El análisis de comentarios requiere al menos una observación escrita.

### 4.10 Autenticación y seguridad

- Contraseñas con Argon2.
- Access token y refresh token JWT.
- Cookies httpOnly.
- Refresh token con estado en Redis.
- CORS configurable con `FRONTEND_URL`, localhost y cualquier subdominio `.vercel.app`.
- Proxy de Vercel para evitar peticiones cross-origin.
- Claves externas solo en backend.
- `VITE_API_URL=/api` en Vercel.

### 4.11 Métricas

Define y explica:

- total de preperitajes;
- completados;
- certificados;
- tasa de aprobación IA;
- tiempo promedio de elaboración;
- historial de inspecciones.

Reglas:

- aprobado = sin hallazgo de severidad alta y `score >= 60`, o sin hallazgos;
- sin IA = aprobado si `score >= 70`;
- tiempo promedio = `actualizado_en - creado_en`.

### 4.12 Despliegue

Describe el estado real:

- Supabase: PostgreSQL con migraciones `001`–`010` aplicadas en `public`.
- Upstash: Redis con URL `rediss://`.
- Render: backend Express.
- Vercel: frontend con Root Directory `frontend`.
- Rewrite en `frontend/vercel.json`.
- Health check: `GET /api/health`.

### 4.13 Limitaciones y riesgos

Incluye obligatoriamente:

- resultados IA orientativos, no peritaje profesional;
- fotos nuevas almacenadas en Supabase Storage: requieren bucket público `autocheck-uploads` y rotación periódica de la service role key;
- recuperación de contraseña no envía correo en producción: solo genera código en Redis;
- CORS acepta cualquier subdominio `.vercel.app`: revisar si debe restringirse;
- dependencia de claves externas;
- catálogo local limitado si API Ninjas no responde;
- `SELF_SIGNED_CERT_IN_CHAIN` puede aparecer con Supabase según el entorno;
- el frontend tiene dependencias heredadas posiblemente sin uso, por ejemplo `@google/genai`, `express` y `dotenv`.

---

## 5. Estructura obligatoria del informe

Genera el documento con esta estructura:

1. **Portada**
   Título, curso, institución, integrantes, tutor, ciudad y fecha.

2. **Resumen ejecutivo**
   Máximo una página. Qué problema resuelve, qué se construyó y qué resultados se obtuvieron.

3. **Introducción**
   Contexto del preperitaje vehicular y motivación del proyecto.

4. **Objetivos**
   General y específicos.

5. **Alcance y limitaciones del alcance**
   Qué cubre AutoCheck y qué no cubre.

6. **Marco teórico o conceptual**
   Preperitaje, IA generativa, visión por computador, JWT, cookies httpOnly, PostgreSQL, Redis, despliegue cloud.

7. **Arquitectura general del sistema**
   Incluye un diagrama Mermaid de componentes.

8. **Diseño de base de datos**
   Incluye un diagrama Mermaid ER con las cinco tablas principales y relaciones.

9. **Diseño de API**
   Tabla de endpoints principales con método, ruta y descripción.

10. **Implementación del frontend**
    Pantallas, flujo de usuario, cuestionario, guías de inspección y cliente API.

11. **Implementación del backend**
    Capas, controladores, servicios, autenticación, IA, archivos y catálogo.

12. **Flujo principal de uso**
    Incluye un diagrama Mermaid de secuencia: registro → cuestionario → fotos → IA → informe → traspaso.

13. **Decisiones técnicas justificadas**
    Por qué Supabase, Redis, Render, Vercel, rewrite `/api`, Gemini, cookies httpOnly, etc.

14. **Seguridad**
    Gestión de secretos, autenticación, CORS, cookies, HTTPS y riesgos.

15. **Despliegue**
    Pasos, variables de entorno por plataforma y verificación.

16. **Pruebas y verificación**
    Comandos ejecutados: build, lint, migraciones, health check, comprobación de tablas.

17. **Resultados**
    Funcionalidades entregadas y evidencias verificables.

18. **Limitaciones y trabajo futuro**
    Incluye las limitaciones listadas arriba y propone mejoras priorizadas.

19. **Conclusiones**

20. **Referencias**
    Documentación oficial de React, Vite, Express, PostgreSQL, Supabase, Redis, Gemini, Render y Vercel. Usa referencias bibliográficas formales; no inventes URLs dudosas.

21. **Anexos**
    - Anexo A: variables de entorno.
    - Anexo B: comandos útiles.
    - Anexo C: estructura de carpetas.
    - Anexo D: glosario.
    - Anexo E: checklist de verificación de despliegue.

---

## 6. Requisitos de redacción y formato

- Usa Markdown.
- Tono formal, claro y técnico.
- Extensión sugerida: equivalente a 15–20 páginas.
- Usa tablas para resúmenes y comparaciones.
- Usa diagramas Mermaid para arquitectura, base de datos y secuencia.
- Cita rutas de archivos con `ruta/archivo.ts:línea` cuando sea útil.
- No uses emojis.
- No inventes cifras de precisión, recall o rendimiento.
- Si una pantalla contiene datos simulados, indícalo.
- Diferencia entre “orientativo”, “implementado” y “verificado”.
- Incluye una sección de “Decisiones técnicas y trade-offs”.
- Incluye una sección de “Riesgos y recomendaciones”.
- En las conclusiones, retoma los objetivos y di si se cumplieron.

---

## 7. Entregable esperado

Genera un único archivo Markdown llamado:

```text
INFORME_TECNICO_AUTOCHECK.md
```

El contenido debe estar listo para guardarse directamente en la raíz del repositorio.

Antes de terminar, incluye una sección final llamada:

```markdown
## Checklist final de consistencia
```

con una lista de verificación que confirme que:

- no se incluyeron secretos;
- no se inventaron datos;
- se usaron diagramas Mermaid;
- se citaron archivos del repositorio;
- se diferenció implementado de desplegado;
- se documentaron limitaciones;
- se incluyeron comandos de verificación.
