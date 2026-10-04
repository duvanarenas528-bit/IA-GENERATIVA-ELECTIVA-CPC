# Historias de usuario

**Proyecto:** Aplicativo web de preperitaje vehicular con IA

## Historia 1 — Registro del usuario
Como usuario, quiero crear una cuenta en la aplicación, para guardar la información de mis vehículos y consultar posteriormente los resultados de mis preperitajes.

**Criterios de aceptación:**
- El usuario puede registrarse proporcionando sus datos básicos.
- El sistema valida que la información obligatoria esté completa.
- El usuario puede iniciar sesión posteriormente.
- El sistema informa si existe algún error durante el registro.

## Historia 2 — Registrar vehículo
Como usuario, quiero registrar los datos de mi vehículo, para que el preperitaje tenga información específica sobre el automóvil que quiero evaluar.

**Criterios de aceptación:**
- El usuario puede ingresar marca, modelo, año, kilometraje y placa.
- El usuario puede seleccionar el tipo de vehículo.
- El sistema valida los campos obligatorios.
- La información queda asociada al usuario.

## Historia 3 — Subir fotografías
Como usuario, quiero subir fotografías de diferentes partes de mi vehículo, para que la aplicación pueda identificar visualmente posibles daños o aspectos que requieran revisión.

**Criterios de aceptación:**
- El usuario puede cargar varias fotografías.
- La aplicación indica qué partes del vehículo debe fotografiar.
- El sistema verifica que las imágenes sean legibles.
- El usuario puede eliminar o reemplazar una fotografía antes de enviar el análisis.

## Historia 4 — Responder preguntas sobre el vehículo
Como usuario, quiero responder preguntas sobre el estado y antecedentes de mi vehículo, para complementar la información obtenida mediante las fotografías.

**Criterios de aceptación:**
- La aplicación presenta preguntas relacionadas con el estado del vehículo.
- El usuario puede responder cada pregunta.
- El sistema identifica las preguntas obligatorias sin responder.
- Las respuestas quedan asociadas al preperitaje.

## Historia 5 — Obtener análisis preliminar mediante IA
Como usuario, quiero que la aplicación analice las fotografías y mis respuestas, para obtener una valoración preliminar del estado del vehículo.

**Criterios de aceptación:**
- El sistema analiza la información suministrada por el usuario.
- La IA identifica posibles daños visibles en las fotografías.
- El resultado diferencia entre aspectos aparentemente normales y aspectos que deberían ser revisados.
- El sistema aclara que el resultado es preliminar y no reemplaza un peritaje profesional.

## Historia 6 — Estimación del valor
Como usuario, quiero conocer un rango estimado del valor de mi vehículo, para tener una referencia antes de realizar una compra, venta o peritaje profesional.

**Criterios de aceptación:**
- El sistema tiene en cuenta los datos suministrados del vehículo.
- El sistema considera los posibles daños identificados.
- La aplicación muestra un rango estimado y no necesariamente un valor exacto.
- El resultado explica de manera sencilla los principales factores que influyeron en la estimación.

## Historia 7 — Ver resultado del preperitaje
Como usuario, quiero consultar un informe con los resultados del preperitaje, para tomar una decisión informada sobre si continuar con un peritaje profesional.

**Criterios de aceptación:**
- El sistema muestra un resumen del estado general del vehículo.
- Se muestran los posibles daños encontrados.
- Se muestra la estimación de valor.
- El usuario puede consultar nuevamente el resultado.

---

## Auditoría de la salida (revisión crítica humana)

| Historia | Evaluación | Justificación |
|---|---|---|
| Registro del usuario | ✅ Útil | Permite identificar al usuario y guardar sus preperitajes. |
| Registrar vehículo | ✅ Útil | Es información fundamental para realizar el análisis. |
| Subir fotografías | ✅ Esencial | Es una de las funciones principales del proyecto. |
| Responder preguntas | ✅ Esencial | Complementa el análisis visual con información que una fotografía no puede proporcionar. |
| Análisis mediante IA | ✅ Esencial | Es el principal componente diferenciador del proyecto. |
| Estimación del valor | ✅ Esencial | Cumple uno de los objetivos principales de la aplicación. |
| Ver resultado | ✅ Útil | Permite al usuario interpretar y utilizar el resultado del preperitaje. |

### Historias que la IA no generó y el equipo consideró que faltaban
1. **Recomendaciones para el peritaje profesional:** el sistema debería indicar qué aspectos deberían ser revisados por un profesional.
2. **Protección de la información:** al manejarse fotografías y datos del vehículo, se requiere una historia sobre privacidad y seguridad de los datos.
3. **Corrección o repetición del análisis:** el usuario debería poder repetir el análisis si las fotos o respuestas fueron de mala calidad.

### Aspectos a revisar críticamente
La IA puede cometer errores al interpretar fotografías o al estimar valores. Por esta razón, el resultado no debe presentarse como un diagnóstico definitivo, sino como una herramienta de orientación que no reemplaza el peritaje profesional.
