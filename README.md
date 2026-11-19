# AutoCheck — Preperitaje Vehicular con Inteligencia Artificial

AutoCheck es una aplicación web full-stack que permite registrar un vehículo, responder un cuestionario técnico, cargar fotografías, generar un informe preliminar con IA y transferir el preperitaje a un nuevo propietario conservando el historial declarado.

> **Aviso importante:** los resultados son orientativos. AutoCheck no reemplaza un peritaje profesional, una inspección presencial ni un diagnóstico técnico oficial.

Última actualización: 18/11/2026.

---

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Base de datos | PostgreSQL |
| Caché / sesiones | Redis |
| IA | Gemini (`@google/genai`), modelo `gemini-3.5-flash-lite` |
| Catálogo vehicular | API Ninjas Cars, con caché en Redis y fallback local |
| Infraestructura local | Docker Compose |
| Autenticación | JWT en cookies httpOnly + refresh token |

---

## Estructura principal

```text
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/migrations/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types.ts
│   └── package.json
├── docker-compose.yml
└── .env.example
```

---

## Requisitos

- Node.js 20 o superior.
- Docker y Docker Compose.
- Clave API de Gemini.
- Clave API de API Ninjas (opcional; sin ella se usa el catálogo local de respaldo).

---

## Configuración local

### 1. Variables de entorno

Copiar la plantilla tanto en la raíz como en `backend/`:

```bash
cp .env.example .env
cp .env.example backend/.env
```

Editar `backend/.env` con las claves reales:

```env
GEMINI_API_KEY=tu_clave_gemini
GEMINI_MODEL=gemini-3.5-flash-lite
API_NINJAS_KEY=tu_clave_api_ninjas
```

> Las claves deben estar solo en el backend. Nunca se exponen en variables `VITE_*` ni en el frontend.

### 2. Levantar PostgreSQL y Redis

```bash
docker compose up -d
```

Servicios:

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### 3. Instalar dependencias

```bash
(cd backend && npm install)
(cd frontend && npm install)
```

### 4. Aplicar migraciones

```bash
cd backend
npm run migrate
```

Migraciones actuales: `001` a `010`, incluyendo análisis IA, traspasos, análisis del cuestionario e historial de mantenimiento.

### 5. Ejecutar la aplicación

En una terminal:

```bash
cd backend
npm run dev
```

En otra terminal:

```bash
cd frontend
npm run dev
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

---

## Comandos de verificación

```bash
cd backend && npm run build
cd frontend && npm run build
cd frontend && npm run lint
```

---

## Flujo de uso

```text
Crear cuenta
  ↓
Registrar vehículo con marca, modelo y año desde catálogo
  ↓
Responder cuestionario por 8 partes del vehículo
  ↓
Registrar historial de mantenimiento
  ↓
Cargar fotografías por zonas
  ↓
Generar informe con reglas e IA
  ↓
Consultar informe detallado, certificado A4 y ficha de venta
  ↓
Transferir el preperitaje a una cuenta existente por correo
  ↓
El nuevo dueño conserva informe, mantenimiento e historial
```

---

## Funcionalidades implementadas

### Cuenta y perfil

- Registro, login, logout y refresh token.
- Recuperación de contraseña con código de 6 dígitos, vigencia de 10 minutos y un solo uso.
- En desarrollo, el código puede mostrarse en la respuesta según `PASSWORD_RESET_SHOW_CODE`.
- Perfil con métricas reales:
  - total de preperitajes;
  - completados;
  - certificados;
  - tasa de aprobación IA;
  - tiempo promedio de elaboración;
  - historial de inspecciones.

### Registro del vehículo

- Placa, marca, línea, año, kilometraje, color, combustible y transmisión.
- Selectores dependientes de marca → modelo → año.
- Catálogo obtenido desde API Ninjas con caché Redis de 24 horas.
- Fallback local cuando la API externa no está disponible.

### Cuestionario

El cuestionario evalúa 8 partes:

1. Lateral derecho.
2. Lateral izquierdo.
3. Frente y capó.
4. Parte trasera y maletero.
5. Techo y cristales.
6. Compartimiento del motor.
7. Llantas y rines.
8. Interior y odómetro.

Las preguntas 1 a 4 usan opciones generales de carrocería. Las preguntas 5 a 8 usan opciones específicas por sección, por ejemplo:

- Cristales: rayones, piquetes, fisuras, vidrio roto, filtración de agua o reemplazo.
- Motor: encendido irregular, fugas, niveles bajos, ruidos, componentes desgastados o reparaciones previas.
- Llantas: desgaste irregular, banda desgastada, grietas, pinchazos, rines golpeados o referencias diferentes.
- Interior: desgaste normal, tapicería deteriorada, tablero dañado, testigos encendidos o inconsistencias del odómetro.

Cada opción tiene una severidad asociada: `optima`, `baja`, `media` o `alta`.

### Historial de mantenimiento

En el paso 2 del cuestionario se registran:

- Fecha del último cambio de aceite.
- Kilometraje en el cambio de aceite.
- Taller o lugar del cambio de aceite.
- Fecha del último mantenimiento.
- Taller o lugar del último mantenimiento.
- Detalle de lo realizado en ese mantenimiento.

El informe calcula adicionalmente:

- kilómetros recorridos desde el cambio de aceite;
- próximo cambio de aceite aproximado, usando una referencia de 5.000 km.

### Fotografías

- Seis zonas sugeridas: frontal, lateral, motor, odómetro, trasera e interior.
- Validación de tipo y tamaño de archivo.
- Fotos asociadas al preperitaje y al propietario actual.
- Las fotos se transfieren junto con el preperitaje.

### Inteligencia Artificial

AutoCheck usa Gemini para dos análisis independientes:

1. **Análisis visual:** examina las fotografías, datos del vehículo y respuestas del cuestionario. Devuelve estado general, hallazgos visuales, recomendaciones y rango de valor estimado en COP.
2. **Análisis de comentarios:** lee las observaciones abiertas del cuestionario y devuelve una explicación por comentario, orientación práctica, prioridad, recomendaciones generales y preguntas sugeridas.

Ambos resultados se guardan en el preperitaje y se muestran en el informe. El análisis de comentarios funciona aunque no haya fotografías, siempre que exista al menos una observación escrita.

### Informe, certificado y ficha de venta

- Informe detallado con score, hallazgos, fotos, análisis IA y orientación sobre comentarios.
- Certificado A4 imprimible y descargable.
- Ficha de venta con estado de partes, historial de mantenimiento y datos para el comprador.
- Avisos legales que indican que el resultado no es vinculante.

### Traspaso al nuevo dueño

- Se realiza desde la ficha de venta indicando el correo de una cuenta existente.
- El backend valida que la cuenta exista antes de transferir.
- Se actualiza `preperitajes.user_id` y `preperitaje_fotos.user_id`.
- Se registran folio, notas, propietario anterior, receptor y fecha de transferencia.
- El nuevo dueño puede consultar el informe y ve el historial de mantenimiento declarado.
- El vendedor conserva el historial como propietario anterior en sus métricas.

---

## API principal

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del backend |
| `POST` | `/api/auth/register` | Registro |
| `POST` | `/api/auth/login` | Inicio de sesión |
| `POST` | `/api/auth/forgot-password` | Solicitar código de recuperación |
| `POST` | `/api/auth/reset-password` | Restablecer contraseña |
| `GET` | `/api/auth/me` | Usuario autenticado |
| `GET` | `/api/vehicles/stats` | Métricas del panel |
| `POST` | `/api/vehicles/preperitajes` | Crear preperitaje |
| `GET` | `/api/vehicles/preperitajes` | Listar preperitajes |
| `GET` | `/api/vehicles/preperitajes/:id` | Obtener preperitaje |
| `PUT` / `PATCH` | `/api/vehicles/preperitajes/:id` | Actualizar preperitaje |
| `GET` | `/api/preperitajes/:id/informe` | Generar/consultar informe |
| `POST` | `/api/preperitajes/:id/analizar-fotos` | Análisis visual con IA |
| `POST` | `/api/preperitajes/:id/analizar-cuestionario` | Análisis de comentarios con IA |
| `POST` | `/api/preperitajes/:id/transferir` | Transferir a otra cuenta |
| `GET` / `POST` | `/api/preperitajes/:id/fotos` | Listar o subir fotos |
| `GET` | `/api/catalog/makes` | Marcas |
| `GET` | `/api/catalog/models?make=...` | Modelos por marca |
| `GET` | `/api/catalog/years?make=...&model=...` | Años por marca/modelo |
| `GET` | `/api/users/me/stats` | Métricas del perfil |
| `GET` | `/api/admin/overview` | Panel administrativo, solo admin |

---

## Consideraciones de seguridad

- Las credenciales y claves externas se leen únicamente en el backend.
- Las contraseñas se almacenan con hash.
- Los tokens de acceso y refresh se envían en cookies httpOnly.
- El refresh token se valida contra Redis.
- El frontend no recibe claves de Gemini ni de API Ninjas.
- Las rutas de preperitajes validan propiedad del recurso; el rol `admin` tiene acceso de lectura cuando corresponde.
- Rotar las claves API antes de compartir o desplegar públicamente el proyecto.

---

## Limitaciones

- La IA puede interpretar incorrectamente fotografías o comentarios.
- El rango de valor es una referencia preliminar, no una tasación comercial.
- El próximo cambio de aceite es una referencia aproximada basada en kilometraje; no reemplaza el plan del fabricante.
- Sin clave de API Ninjas se usa un catálogo local limitado.
- Sin clave de Gemini no se generan los análisis IA; el informe de reglas sigue funcionando.

---

## Documentación académica

* [Diagrama de componentes](mi-framework-ia/docs/proyecto/07_DIAGRAMA_COMPONENTES.md)
* [Diagrama de base de datos](mi-framework-ia/docs/proyecto/08_DIAGRAMA_BASE_DATOS.md)
* [Diagrama de clases](mi-framework-ia/docs/proyecto/09_DIAGRAMA_CLASES.md)
* [Historias de usuario](mi-framework-ia/docs/proyecto/03_HISTORIAS_USUARIO.md)
* [Requerimientos](mi-framework-ia/docs/proyecto/02_REQUERIMIENTOS.md)
* [Detalle del proyecto y prompts](mi-framework-ia/docs/proyecto/README.md)

---

## Información académica

- Proyecto: IA Generativa — AutoCheck
- Institución: Corporación Universitaria Minuto de Dios — UNIMINUTO
- Programa: Ingeniería de Sistemas
- Asignatura: Electiva CPC

Integrantes:

* Duban Tibaquira
* Leni Santiago Murillo

- Tutor: Esteban
- Ciudad: Ibagué
- Fecha original del proyecto: 05/10/2026
