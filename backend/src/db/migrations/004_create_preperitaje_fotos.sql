CREATE TABLE IF NOT EXISTS preperitaje_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preperitaje_id UUID NOT NULL REFERENCES preperitajes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  zona VARCHAR(32) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(64) NOT NULL,
  size_bytes INTEGER NOT NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (preperitaje_id, zona)
);

CREATE INDEX IF NOT EXISTS idx_preperitaje_fotos_preperitaje_id ON preperitaje_fotos(preperitaje_id);
CREATE INDEX IF NOT EXISTS idx_preperitaje_fotos_user_id ON preperitaje_fotos(user_id);
