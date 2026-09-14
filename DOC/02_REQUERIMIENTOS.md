# Requerimientos del sistema

**Proyecto:** Aplicativo web de preperitaje vehicular con IA

## Requerimiento principal (lenguaje del cliente)

> Como usuario, quiero enviar fotos de mi vehículo y responder algunas preguntas sobre su estado para recibir una valoración preliminar que me permita saber si vale la pena realizar un peritaje profesional.

## Requerimientos funcionales (RF)

| Código | Requerimiento |
|---|---|
| RF01 | El sistema debe permitir al usuario crear una cuenta e iniciar sesión. |
| RF02 | El sistema debe permitir registrar los datos básicos del vehículo (marca, modelo, año, kilometraje, placa). |
| RF03 | El sistema debe permitir subir múltiples fotografías del vehículo (exterior, interior, motor, llantas). |
| RF04 | El sistema debe presentar un cuestionario sobre el estado y antecedentes del vehículo. |
| RF05 | El sistema debe enviar las fotografías y respuestas a un modelo de IA (API de Gemini) para su análisis. |
| RF06 | El sistema debe mostrar al usuario los posibles daños o aspectos detectados en las fotografías. |
| RF07 | El sistema debe generar un rango estimado de valor del vehículo, no un valor exacto. |
| RF08 | El sistema debe generar un informe final del preperitaje que el usuario pueda consultar. |
| RF09 | El sistema debe indicar explícitamente que el resultado es preliminar y no reemplaza un peritaje profesional. |
| RF10 | El sistema debe permitir al usuario repetir el análisis si las fotos o respuestas fueron incorrectas o de mala calidad. |

## Requerimientos no funcionales (RNF)

| Código | Requerimiento |
|---|---|
| RNF01 | El sistema debe ser accesible desde navegador web, sin necesidad de instalación. |
| RNF02 | El tiempo de respuesta del análisis de IA no debe superar un tiempo razonable de espera para el usuario (ej. menos de 1 minuto). |
| RNF03 | El sistema debe proteger los datos personales y las fotografías del usuario. |
| RNF04 | El sistema debe poder construirse con herramientas gratuitas o de nivel de prueba, dado que es un proyecto académico sin presupuesto. |
| RNF05 | La interfaz debe ser simple e intuitiva para usuarios sin conocimientos técnicos de mecánica. |
| RNF06 | El sistema debe ser escalable a nivel de código para permitir agregar más criterios de análisis en el futuro. |

## Fuente
Extraído a partir de `DOC/01_TRANSCRIPCION.md` usando el prompt en `DOCIA/02_PROMPT_REQUERIMIENTOS.md`.
