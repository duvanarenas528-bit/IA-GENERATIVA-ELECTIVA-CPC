# Prompt · Construcción del Product Backlog

## Objetivo
Convertir las historias de usuario priorizadas en un Product Backlog estructurado, listo para gestionarse en una herramienta tipo Jira.

## Prompt utilizado

```
Actúa como Scrum Master. A partir de las historias de usuario priorizadas
con MoSCoW, construye un Product Backlog en formato de tabla con las
siguientes columnas:

- ID
- Épica
- Historia de usuario (resumen corto)
- Prioridad (Must/Should/Could/Won't)
- Estimación (talla de camiseta: XS, S, M, L, XL)
- Sprint sugerido (1, 2, 3...)

Agrupa las historias en épicas coherentes (por ejemplo: Gestión de usuarios,
Gestión de vehículos, Captura de evidencia, Análisis con IA, Resultados y
reportes, Seguridad).

Historias priorizadas:
[pegar contenido de 04_PRIORIZACION_MOSCOW.md]
```

## Notas de uso
- El backlog resultante (`DOC/05_PRODUCT_BACKLOG.md`) es el insumo directo para la creación de tickets en Jira mediante el conector MCP (ver `DOCIA/06_PROMPT_JIRA_MCP.md`).
