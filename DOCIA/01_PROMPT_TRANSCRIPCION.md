# Prompt · Entrevista y transcripción simulada

## Objetivo
Simular una entrevista entre un analista de requisitos y el cliente/usuario final del proyecto **"Preperitaje vehicular con IA"**, para luego transcribirla como insumo del levantamiento de requisitos.

## Prompt utilizado

```
Actúa como un analista de requisitos de software que está entrevistando a un
cliente para levantar información sobre una idea de producto.

Contexto del proyecto: una aplicación web que permite a una persona subir
fotografías de su vehículo y responder algunas preguntas, para recibir un
preperitaje preliminar (posibles daños y un rango estimado de valor) antes de
pagar un peritaje profesional. La app usará un modelo de IA (API de Gemini)
para analizar las fotos y las respuestas.

Simula una entrevista de 8 a 10 preguntas y respuestas entre el analista y el
cliente, donde el analista busca entender:
- el problema que se quiere resolver,
- quién es el usuario final,
- qué información necesita el sistema,
- qué resultado espera obtener el usuario,
- restricciones (tiempo, plataforma, presupuesto).

Entrega el resultado como una transcripción en formato diálogo (Analista /
Cliente), en español, sin jerga técnica de parte del cliente.
```

## Notas de uso
- Este prompt se ejecutó una sola vez y el resultado se copió sin ediciones mayores a `DOC/01_TRANSCRIPCION.md`.
- Se usó como paso previo a la extracción de requerimientos (Parte 1 del taller).
