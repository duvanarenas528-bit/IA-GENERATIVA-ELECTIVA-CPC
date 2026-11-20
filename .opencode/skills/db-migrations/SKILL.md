---
name: db-migrations
description: Create and audit idempotent SQL migrations in backend/src/db/migrations/ for AutoCheck. Use when adding tables, columns, indexes, constraints or JSONB fields to PostgreSQL/Supabase.
---

# Migraciones SQL seguras

Usa esta skill siempre que se cree o audite una migración en `backend/src/db/migrations/`.

## Principios obligatorios

1. Nunca editar una migración ya aplicada. Crear una nueva migración con el siguiente número secuencial.
2. Toda sentencia debe poder ejecutarse dos veces sin error:
   - `CREATE TABLE IF NOT EXISTS`
   - `ADD COLUMN IF NOT EXISTS`
   - `CREATE INDEX IF NOT EXISTS`
   - `CREATE CONSTRAINT` solo tras comprobar que no existe, o usar `ADD CONSTRAINT ... IF NOT EXISTS` cuando la versión de PostgreSQL lo permita.
3. Prohibido `DROP TABLE`, `DROP COLUMN`, `TRUNCATE` o `DELETE` masivo salvo autorización explícita del usuario.
4. Usar `TIMESTAMPTZ NOT NULL DEFAULT NOW()` para fechas de creación.
5. Usar `JSONB` para estructuras dinámicas como `respuestas`, metadatos o configuraciones. La aplicación debe serializar con `JSON.stringify` antes de enviar objetos o arrays.
6. Toda llave foránea debe declarar integridad referencial:
   - `REFERENCES users(id) ON DELETE CASCADE`
   - `REFERENCES preperitajes(id) ON DELETE CASCADE`
   - Ajustar `ON DELETE` según la semántica real, nunca por defecto sin revisar.
7. Indexar con B-Tree:
   - `user_id`
   - `preperitaje_id`
   - columnas usadas en `WHERE`, `ORDER BY` o joins frecuentes.
   - Patrón: `CREATE INDEX IF NOT EXISTS idx_tabla_columna ON tabla (columna);`
8. Para búsquedas dentro de `JSONB`, usar índices GIN solo cuando esté justificado; para filtros normales mantener B-Tree.
9. Nombres en `snake_case`, índices con prefijo `idx_`, llaves foráneas con prefijo `fk_`, constraints únicas con prefijo `uq_`.
10. No hardcodear URLs, passwords ni cadenas de conexión. Usar Variables de entorno del backend.

## Plantilla base

```sql
CREATE TABLE IF NOT EXISTS ejemplo_tabla (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preperitaje_id UUID NOT NULL REFERENCES preperitajes(id) ON DELETE CASCADE,
  datos JSONB NOT NULL DEFAULT '{}'::jsonb,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ejemplo_tabla_user_id
  ON ejemplo_tabla (user_id);

CREATE INDEX IF NOT EXISTS idx_ejemplo_tabla_preperitaje_id
  ON ejemplo_tabla (preperitaje_id);
```

## Para agregar columnas

```sql
ALTER TABLE preperitajes
  ADD COLUMN IF NOT EXISTS metadatos JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_preperitajes_user_id
  ON preperitajes (user_id);
```

## Checklist de auditoría

- La migración es idempotente: se puede ejecutar dos veces seguidas.
- No destruye datos existentes sin autorización.
- Usa `JSONB` para estructuras dinámicas.
- Serialización `JSON.stringify` confirmada en el código que escribe la columna.
- Llaves foráneas e índices B-Tree presentes.
- Nombres de constraints e índices coherentes.
- Tipos TypeScript actualizados si la columna cambia la forma de una respuesta.
- Backend compila con `cd backend && npm run build`.
- No aparece secretos ni cadenas de conexión en el diff.

## Verificación recomendada

```bash
cd backend && npm run migrate
cd backend && npm run migrate
cd backend && npm run build
```

Si la segunda ejecución falla, la migración no es idempotente y debe corregirse.
