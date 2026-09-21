# Diagrama de componentes

Este diagrama representa la arquitectura de alto nivel del sistema de prepaje vehicular con IA, mostrando cómo el usuario interactúa con la aplicación, cómo el backend coordina la lógica de negocio, y cómo se integran Supabase y el servicio externo de IA para gestionar autenticación, datos, archivos y análisis.

```mermaid
flowchart TD
    U[Usuario final] -->|registra / inicia sesión| FW[Frontend Web]
    U -->|sube fotos| FW
    U -->|responde cuestionario| FW
    U -->|consulta resultados| FW

    FW -->|envía credenciales| MA[Módulo de Autenticación]
    FW -->|envía datos del vehículo| B[Backend / API]
    FW -->|sube fotos| B
    FW -->|solicita análisis| B
    FW -->|obtiene resultado| B

    MA -->|valida usuario| B
    B -->|crea sesión| MA
    B -->|responde con token| FW

    subgraph S[Supabase (Backend as a Service)]
        DB[(Base de datos)]
        ST[(Almacenamiento de archivos)]
    end

    B -->|guarda usuarios / vehículos / respuestas| DB
    B -->|consulta datos| DB
    B -->|almacena resultados| DB
    B -->|guarda fotos| ST
    B -->|obtiene archivos| ST

    IA[Servicio de IA externo
    Gemini]:::externo
    B -->|envía fotos + respuestas| IA
    IA -->|devuelve resultado JSON| B

    classDef externo fill:#f5f5f5,stroke:#666,stroke-width:1.5px,color:#222;
```
