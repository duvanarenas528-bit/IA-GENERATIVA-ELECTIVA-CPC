# Frontend AutoCheck

Aplicación React + TypeScript + Vite para el preperitaje vehicular.

## Ejecutar en local

Requisitos: Node.js 20 o superior y el backend de AutoCheck corriendo en `http://localhost:4000`.

```bash
npm install
npm run dev
```

El frontend queda disponible en http://localhost:5173.

## Configuración

La URL del backend se configura con `VITE_API_URL`:

```bash
cp .env.example .env.local
```

Por defecto es `http://localhost:4000/api`. En Vercel debe apuntar a `https://TU-BACKEND/api`.

No configurar claves de Gemini ni de API Ninjas en este proyecto. Todas las claves externas se usan únicamente en el backend. Consulta el [README principal](../README.md) para configurar `.env`, PostgreSQL, Redis y las migraciones.

## Verificación

```bash
npm run build
npm run lint
```
