CREATE TABLE IF NOT EXISTS preperitajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  placa VARCHAR(32) NOT NULL,
  marca VARCHAR(128),
  linea VARCHAR(128),
  anio INTEGER,
  kilometraje INTEGER,
  color VARCHAR(64),
  combustible VARCHAR(32),
  transmision VARCHAR(32),
  respuestas JSONB DEFAULT '{}'::jsonb,
  estado VARCHAR(16) NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador','completado')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preperitajes_user_id ON preperitajes(user_id);
