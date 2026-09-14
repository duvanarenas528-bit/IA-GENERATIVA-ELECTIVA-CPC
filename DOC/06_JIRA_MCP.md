# Conexión con Jira mediante MCP

**Proyecto Jira:** PREPERITAJE VEHICULAR (clave sugerida: `PV`)

## Resumen del proceso
Usando el prompt/instrucción de `DOCIA/06_PROMPT_JIRA_MCP.md`, se conectó el asistente de IA al servidor MCP de Jira y se generaron los issues correspondientes a cada elemento del Product Backlog (`DOC/05_PRODUCT_BACKLOG.md`).

## Mapeo Backlog → Jira

| ID Backlog | ID Jira sugerido | Tipo | Épica | Prioridad Jira | Sprint |
|---|---|---|---|---|---|
| PV-01 | PV-1 | Story | Gestión de usuarios | High | 1 |
| PV-02 | PV-2 | Story | Gestión de vehículos | High | 1 |
| PV-03 | PV-3 | Story | Captura de evidencia | High | 1 |
| PV-04 | PV-4 | Story | Captura de evidencia | High | 1 |
| PV-05 | PV-5 | Story | Análisis con IA | High | 2 |
| PV-06 | PV-6 | Story | Análisis con IA | High | 2 |
| PV-07 | PV-7 | Story | Resultados y reportes | Medium | 2 |
| PV-08 | PV-8 | Story | Seguridad | Medium | 3 |
| PV-09 | PV-9 | Story | Análisis con IA | Medium | 3 |
| PV-10 | PV-10 | Story | Resultados y reportes | Low | 3 |

## Estado de la integración
> **Nota:** este documento describe el flujo que el equipo ejecutaría con el conector MCP de Jira. Si al momento de generar este archivo no se contaba con credenciales activas del workspace de Jira del equipo, el mapeo anterior debe tratarse como una simulación del resultado esperado, y actualizarse con los IDs reales una vez se ejecute la conexión MCP con el proyecto de Jira del equipo.

## Siguientes pasos sugeridos
1. Verificar que el conector MCP de Jira esté autenticado con el workspace del equipo.
2. Ejecutar el prompt de `DOCIA/06_PROMPT_JIRA_MCP.md` contra el backlog real.
3. Reemplazar los IDs sugeridos en la tabla anterior por los IDs reales devueltos por Jira.
4. Verificar en el tablero Scrum/Kanban del proyecto que las historias Must (Sprint 1) queden como primeras en el backlog.
