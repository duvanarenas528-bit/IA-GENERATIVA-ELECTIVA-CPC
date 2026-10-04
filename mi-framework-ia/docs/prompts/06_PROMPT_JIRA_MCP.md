# Prompt / instrucciones · Conexión con Jira mediante MCP

## Objetivo
Usar un conector MCP (Model Context Protocol) hacia Jira para crear automáticamente los tickets del Product Backlog como issues del proyecto.

## Prompt / instrucción utilizada

```
Conéctate al servidor MCP de Jira del proyecto "PREPERITAJE VEHICULAR".
Toma cada fila del siguiente Product Backlog y crea un issue en Jira con:

- Título: la historia de usuario (resumen corto)
- Tipo de issue: "Story"
- Épica: la épica indicada
- Prioridad: mapea Must -> High, Should -> Medium, Could -> Low
- Etiqueta de sprint: el sprint sugerido
- Descripción: la historia completa en formato "Como / quiero / para"
  junto con sus criterios de aceptación

Backlog:
[pegar contenido de 05_PRODUCT_BACKLOG.md y 03_HISTORIAS_USUARIO.md]

Al finalizar, devuelve un listado de los IDs de issue creados en Jira,
mapeados contra el ID interno del backlog (PV-XX).
```

## Notas de uso
- Este paso requiere tener configurado el conector MCP de Jira con las credenciales del workspace del equipo.
- El resultado (issues creados, IDs de Jira, y su mapeo con el backlog) queda documentado en `DOC/06_JIRA_MCP.md`.
- Si en el momento de la sustentación no se cuenta con acceso real a Jira, este archivo puede documentarse como una simulación del flujo, dejando explícito que el mapeo y los IDs son ilustrativos.
