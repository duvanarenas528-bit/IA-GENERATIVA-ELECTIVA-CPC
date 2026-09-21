# Preperitaje Vehicular con IA — Documentación del proceso

## Descripción del proyecto
Aplicación web que permite a una persona realizar un preperitaje preliminar de su vehículo, mediante el envío de fotografías y respuestas a un cuestionario sobre su estado. La aplicación usa inteligencia artificial (API de Gemini) para analizar la información y generar una valoración preliminar, posibles daños detectados y un rango estimado de valor, antes de que el usuario decida pagar un peritaje profesional.

## Estructura del repositorio de documentación

```
PREPERITAJE-VEHICULAR/
│
├── DOCIA/   → prompts utilizados con la IA en cada etapa
│   ├── 01_PROMPT_TRANSCRIPCION.md
│   ├── 02_PROMPT_REQUERIMIENTOS.md
│   ├── 03_PROMPT_HISTORIAS_USUARIO.md
│   ├── 04_PROMPT_PRIORIZACION_MOSCOW.md
│   ├── 05_PROMPT_PRODUCT_BACKLOG.md
│   ├── 06_PROMPT_JIRA_MCP.md
│   └── 07_PROMPT_DIAGRAMAS.md
│
└── DOC/    → resultados / documentación generada en cada etapa
    ├── 01_TRANSCRIPCION.md
    ├── 02_REQUERIMIENTOS.md
    ├── 03_HISTORIAS_USUARIO.md
    ├── 04_PRIORIZACION_MOSCOW.md
    ├── 05_PRODUCT_BACKLOG.md
    ├── 06_JIRA_MCP.md
    ├── 07_DIAGRAMA_COMPONENTES.md
    ├── 08_DIAGRAMA_BASE_DATOS.md
    └── README.md   (este archivo)
```

## Flujo de trabajo seguido
1. **Entrevista y transcripción** — simulación de una entrevista con el cliente para entender el problema y las necesidades.
2. **Requerimientos** — extracción de la frase de requerimiento y de los requerimientos funcionales/no funcionales.
3. **Historias de usuario** — generación de historias con criterios de aceptación y auditoría crítica humana.
4. **Priorización MoSCoW** — clasificación de las historias según su importancia para el MVP.
5. **Product Backlog** — organización de las historias en épicas, con estimación y sprint sugerido.
6. **Conexión con Jira (MCP)** — creación de los issues del backlog en Jira a través de un conector MCP.
7. **Diagrama de componentes** — arquitectura de alto nivel: frontend, backend, Supabase y servicio de IA externo (Gemini).
8. **Diagrama de base de datos** — modelo relacional sobre Supabase/PostgreSQL (usuarios, vehículos, preperitajes, fotografías, preguntas y respuestas).

## Nota sobre el uso de IA
Todos los resultados generados por la IA en las carpetas `DOC/` fueron sometidos a revisión crítica humana por el equipo antes de considerarse definitivos, en particular en la etapa de historias de usuario (ver la sección de auditoría en `DOC/03_HISTORIAS_USUARIO.md`).
