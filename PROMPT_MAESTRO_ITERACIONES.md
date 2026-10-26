# Prompt maestro y trazabilidad de iteraciones

Documento de apoyo para el proyecto **PREPERITAJE-VEHICULAR**. Resume el prompt maestro consolidado, las iteraciones reales de trabajo y la comparación entre cada prompt.

---

## 1. Resumen ejecutivo

Para llegar al estado funcional actual se necesitaron:

- **2 prompts funcionales** que cambiaron el producto.
- **5 iteraciones técnicas internas** de implementación y verificación.
- **1 prompt adicional** para generar este documento.

En total: **3 prompts** y **6 ciclos de trabajo** si se cuenta la documentación.

Es importante diferenciar dos conceptos:

1. **Iteraciones de prompt:** cambios solicitados por el usuario.
2. **Iteraciones de implementación:** ajustes técnicos realizados dentro de un mismo prompt para cumplir los criterios.

En este proyecto no hubo correcciones sucesivas del usuario sobre el segundo prompt. Las 5 iteraciones internas ocurrieron dentro de la misma solicitud funcional.

---

## 2. Prompt maestro consolidado

Este es el prompt que, entregado desde cero, describe el estado deseado del sistema y las restricciones para alcanzarlo.

```text
Actúa como desarrollador full-stack senior. Trabaja sobre el repositorio PREPERITAJE-VEHICULAR.

CONTEXTO TÉCNICO
- Backend: Node.js + Express + TypeScript + PostgreSQL (pg) + Redis.
- Frontend: React + Vite + TypeScript + Tailwind CSS.
- Autenticación existente con cookies httpOnly (access_token / refresh_token) y middleware requireAuth.
- Ya existen usuarios, vehículos, preperitajes, reportes y una UI funcional de preperitaje.
- La tabla preperitajes tiene la columna respuestas de tipo JSONB.
- Gemini NO se usa todavía. No implementes llamadas reales a IA.

RESTRICCIONES NO NEGOCIABLES
- Trabaja solo en frontend/src y backend/src.
- Puedes tocar .gitignore y los archivos de dependencias cuando sea imprescindible.
- No modifiques clases, estilos ni estructura visual existentes. Reutiliza las clases y componentes actuales.
- No inventes hallazgos, precios, puntajes ni datos clínicos.
- No expongas carpetas públicas para fotos.
- Mantén el código preparado para que un servicio de Gemini reemplace el diagnóstico por reglas sin reescribir la UI.

OBJETIVO 1: CORREGIR EL ERROR JSONB
Al guardar respuestas del cuestionario (un array de objetos) PostgreSQL responde:
"invalid input syntax for type json", código 22P02.
Causa: node-postgres serializa arrays de JavaScript como literales de array PostgreSQL, no como JSON.
Solución: serializar explícitamente objetos y arrays con JSON.stringify antes de enviarlos a columnas JSONB.
Aplica la corrección en creación y actualización de preperitajes y en cualquier columna JSONB afectada.
No rompas el caso en que el valor ya venga como string o null.

OBJETIVO 2: FOTOS REALES DEL PREPERITAJE
En el paso 3 del preperitaje existen 6 tarjetas de zona:
01 Frontal Tres Cuartos, 02 Lateral Completo, 03 Vano Motor,
04 Odómetro y Tablero, 05 Parte Trasera, 06 Interior / Tapicería.

Requisitos:
- Cada tarjeta permite subir UNA imagen propia.
- Al seleccionar el archivo, subirlo inmediatamente con multipart/form-data a:
  POST /api/preperitajes/:id/fotos
- La ruta debe usar requireAuth y multer.
- Formatos permitidos: JPG, PNG y WEBP.
- Tamaño máximo: 5 MB.
- Nombre de archivo aleatorio.
- Guardar en backend/uploads/ y agregar esa carpeta al .gitignore.
- Asociar cada foto a usuario, preperitaje y zona.
- Reemplazar una foto de la misma zona debe actualizar el registro y borrar el archivo anterior.
- Servir las imágenes con un endpoint autenticado que verifique que la foto pertenece al usuario:
  GET /api/preperitajes/:id/fotos/:fotoId/archivo
- No usar carpetas públicas ni rutas estáticas.
- Quitar todas las fotos de ejemplo. Las tarjetas deben iniciar vacías.
- Mostrar vista previa de la imagen subida y permitir reemplazarla.
- Mostrar errores claros para formato inválido, archivo mayor a 5 MB, preperitaje inexistente o falta de sesión.

OBJETIVO 3: INFORME SIN IA
- El botón "Generar Informe" debe guardar el preperitaje como estado 'completado' y abrir /informe/:id.
- El informe debe mostrar datos REALES del vehículo:
  placa, marca, línea, año, kilometraje, color, combustible y transmisión.
- Debe mostrar las respuestas del paso 2 resumidas.
- Debe mostrar las fotos subidas.
- Debe mostrar la fecha de emisión y el usuario.
- Los apartados de diagnóstico deben llenarse con un texto generado por reglas simples a partir de las respuestas, por ejemplo listando las partes marcadas con problemas.
- El texto debe estar identificado con la etiqueta pequeña: "Diagnóstico de prueba, sin IA".
- No inventar hallazgos, precios, rangos de mercado ni puntajes no derivados de los datos.
- Si se muestra un índice o porcentaje, debe calcularse de forma transparente a partir de las respuestas.
- El informe debe poder abrirse desde la lista del Inicio.
- Debe seguir disponible después de recargar la página y después de cerrar y volver a iniciar sesión.
- El diagnóstico por reglas debe vivir en un servicio separado del controlador, de modo que luego se reemplace por Gemini sin tocar la pantalla del informe.

BACKEND ESPERADO
- Migración para la tabla de fotos del preperitaje.
- Middleware de subida con multer y validaciones.
- Controlador de fotos e informe.
- Router montado en /api/preperitajes.
- Endpoint de informe:
  GET /api/preperitajes/:id/informe
- Validar propiedad del preperitaje y de cada foto.
- Limpiar archivos si falla la validación o la escritura en base de datos.

FRONTEND ESPERADO
- Subida de fotos desde el paso 3, sin fotos de ejemplo.
- Vista previa, reemplazo y mensajes de error.
- Navegación real a /informe/:id.
- Soporte de recarga directa de esa URL.
- Pantalla de informe alimentada por el endpoint, no por datos quemados.
- Lista del Inicio con acceso a los informes completados.
- Mantener las clases y la estructura visual existentes.

CRITERIOS DE ACEPTACIÓN
1. npm run migrate ejecuta sin errores.
2. Backend compila con npm run build.
3. Frontend pasa npm run lint y npm run build.
4. Se puede crear un preperitaje, subir una imagen válida y verla.
5. Un PDF o una imagen de más de 5 MB muestra un error claro.
6. Una foto no puede abrirse sin sesión y tampoco puede abrirse por otro usuario.
7. Generar Informe guarda estado 'completado' y abre /informe/:id.
8. Recargar /informe/:id mantiene el informe.
9. El informe contiene datos reales, respuestas, fotos, fecha y usuario.
10. El diagnóstico indica claramente "Diagnóstico de prueba, sin IA".
11. No existe ningún dato de hallazgo, precio o puntaje inventado.
12. El código queda preparado para sustituir las reglas por Gemini.

VERIFICACIÓN ESPERADA
- Probar el flujo completo con una cuenta real.
- Probar errores de formato y tamaño.
- Probar acceso no autenticado al archivo de la foto.
- Revisar que backend/uploads/ tenga nombres aleatorios.
- Confirmar persistencia tras recarga y tras cerrar y abrir sesión.
- Ejecutar build y lint.

ENTREGA
Explica brevemente qué se cambió, qué archivos se tocaron y cómo probarlo.
```

---

## 3. Comparativa entre prompts funcionales

| Prompt | Tipo | Objetivo principal | Alcance | Restricciones nuevas | Resultado |
|---|---|---|---|---|---|
| Prompt 1 | Correctivo | Corregir error `22P02` al guardar `respuestas` en JSONB | Un controlador y un helper de serialización | No romper strings ni null | Se corrigió creación/actualización de preperitajes y el guardado de reportes |
| Prompt 2 | Funcional | Implementar fotos reales e informe sin IA | Backend, frontend, base de datos, rutas, persistencia y reporte por reglas | No tocar estilos ni estructura visual; no usar Gemini; no inventar datos | Se implementó el flujo completo de fotos e informe persistente |
| Prompt 3 | Documentación | Generar este documento | Solo documentación | Ninguna sobre el código | Se creó este archivo, sin cambios funcionales |

### Qué cambió de un prompt a otro

- **Prompt 1 → Prompt 2:** se pasó de una corrección puntual a una funcionalidad completa. Aparecen restricciones de seguridad (fotos autenticadas), límites de archivo, persistencia, navegación por URL y separación del diagnóstico en un servicio.
- **Prompt 2 → Prompt 3:** no cambia el producto. Se solicita documentar el prompt maestro y las iteraciones.
- **Diferencia clave:** el Prompt 1 no exigía diseño ni persistencia nueva; el Prompt 2 sí exigió conservar la UI existente y agregar funcionalidad sin rediseñarla.

---

## 4. Iteraciones técnicas internas del Prompt 2

| # | Iteración | Qué se hizo | Archivos principales | Resultado |
|---|---|---|---|---|
| 1 | Backend de fotos | Migración, multer, almacenamiento aleatorio, validaciones y rutas autenticadas | `004_create_preperitaje_fotos.sql`, `middlewares/upload.ts`, `routes/preperitajes.ts`, `controllers/preperitajesController.ts` | Subida, reemplazo, listado y descarga autenticada funcionando |
| 2 | Frontend de fotos | Se quitaron fotos de ejemplo, se agregó selección, vista previa, reemplazo y errores | `NuevoPreperitajeScreen.tsx`, `services/api.ts` | Tarjetas vacías y carga real de imágenes |
| 3 | Persistencia y navegación | Guardar como completado y abrir `/informe/:id`, con soporte de recarga y retroceso | `App.tsx`, `services/navigation.ts`, `DashboardScreen.tsx` | Informe accesible por URL y desde Inicio |
| 4 | Informe por reglas | Servicio de diagnóstico, resumen de respuestas, fotos, fecha y usuario | `services/preperitajeReport.ts`, `InformeDetalladoScreen.tsx`, `types.ts` | Informe dinámico sin datos quemados |
| 5 | Verificación y ajustes | Pruebas de API, validación de tamaño/formato, corrección de redacción y lint | Varios | Flujo validado y compilación correcta |

### Iteraciones internas resumidas

1. **Backend primero:** se resolvió almacenamiento, seguridad y base de datos antes de tocar la UI.
2. **Frontend después:** se conectó la UI existente sin cambiar su diseño.
3. **Persistencia y rutas:** se agregó la URL real del informe y la reapertura desde Inicio.
4. **Diagnóstico:** se separó la lógica de reglas en un servicio reemplazable.
5. **Calidad:** se probaron casos felices y errores, y se corrigieron detalles de tipado y redacción.

---

## 5. Conteo final de iteraciones

| Métrica | Cantidad |
|---|---:|
| Prompts funcionales que modificaron el producto | 2 |
| Prompts totales incluyendo documentación | 3 |
| Iteraciones técnicas internas | 5 |
| Ciclos totales de trabajo | 6 |
| Archivos nuevos creados | 6 |
| Migraciones nuevas | 1 |
| Endpoints nuevos | 4 |

### Archivos nuevos

- `backend/src/db/migrations/004_create_preperitaje_fotos.sql`
- `backend/src/middlewares/upload.ts`
- `backend/src/controllers/preperitajesController.ts`
- `backend/src/routes/preperitajes.ts`
- `backend/src/services/preperitajeReport.ts`
- `frontend/src/services/navigation.ts`

### Endpoints nuevos

- `POST /api/preperitajes/:id/fotos`
- `GET /api/preperitajes/:id/fotos`
- `GET /api/preperitajes/:id/fotos/:fotoId/archivo`
- `GET /api/preperitajes/:id/informe`

---

## 6. Conclusión

El proyecto llegó al estado deseado con **2 prompts funcionales**. El segundo prompt fue el que concentró la mayor parte del trabajo y requirió **5 iteraciones técnicas internas** para cubrir backend, frontend, persistencia, seguridad y verificación.

Si se incluye la solicitud de documentación, el total es **3 prompts y 6 ciclos de trabajo**. No fue necesario un tercer prompt correctivo del usuario: los ajustes posteriores al Prompt 2 fueron decisiones de implementación y validación dentro del mismo alcance.
