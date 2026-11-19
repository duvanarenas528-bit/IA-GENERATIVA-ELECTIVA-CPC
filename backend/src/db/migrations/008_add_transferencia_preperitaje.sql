ALTER TABLE preperitajes
  DROP CONSTRAINT IF EXISTS preperitajes_propietario_anterior_id_fkey,
  DROP CONSTRAINT IF EXISTS preperitajes_transferido_a_id_fkey;

ALTER TABLE preperitajes
  ADD COLUMN IF NOT EXISTS propietario_anterior_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS transferido_a_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS transferido_en TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS transferencia_folio TEXT,
  ADD COLUMN IF NOT EXISTS transferencia_notas TEXT;

CREATE INDEX IF NOT EXISTS idx_preperitajes_transferido_a ON preperitajes(transferido_a_id);
