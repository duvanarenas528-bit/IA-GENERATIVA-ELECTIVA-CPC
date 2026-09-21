# Prompt / instrucciones · Diagrama de componentes y base de datos

## Objetivo
Generar los diagramas de arquitectura (componentes y base de datos) del sistema de preperitaje vehicular con IA, a partir de los requerimientos e historias de usuario documentados.

## Prompt / instrucción utilizada

```
A partir de la siguiente información del proyecto de preperitaje vehicular con IA,
genera dos diagramas en Mermaid:

Tecnologías definidas:
- Frontend web
- Backend / API
- Supabase (PostgreSQL + Storage + Auth)
- Servicio externo de IA (API de Gemini)

1) Diagrama de componentes (flowchart):
   Muestra cómo el usuario interactúa con el frontend, cómo el backend coordina la
   lógica, el módulo de autenticación, Supabase (base de datos y almacenamiento de
   archivos) y el servicio de IA externo, indicando el flujo de cada operación
   (registro, carga de fotos, cuestionario, análisis, resultados).

2) Diagrama de base de datos (erDiagram):
   Propón el modelo relacional sobre Supabase/PostgreSQL que cumpla los siguientes
   requerimientos funcionales:

   [pegar contenido de 02_REQUERIMIENTOS.md]

   Incluye las tablas necesarias para: usuarios, vehículos, preperitajes (resultados
   de la IA y rango de valor estimado), fotografías, preguntas del cuestionario y
   respuestas del usuario. Relaciónalas con sus llaves foráneas y campos clave, y
   anota cómo aplican RLS, auth y el bucket de almacenamiento de Supabase.

Info del proyecto:
[pegar contenido de 01_TRANSCRIPCION.md, 02_REQUERIMIENTOS.md y 03_HISTORIAS_USUARIO.md]
```

## Resultado esperado
- Diagrama de componentes → `DOC/07_DIAGRAMA_COMPONENTES.md`.
- Diagrama de base de datos → `DOC/08_DIAGRAMA_BASE_DATOS.md`.

## Notas de uso
- Los diagramas deben mantener coherencia con el Product Backlog (`DOC/05_PRODUCT_BACKLOG.md`) y con las historias de seguridad (RLS) y de repetición del análisis.
- El modelo debe reflejar que el valor estimado es un rango (`valor_min`/`valor_max`) y que el resultado completo de la IA se conserva como JSON.