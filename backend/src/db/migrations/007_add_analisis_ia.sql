ALTER TABLE preperitajes
  ADD COLUMN IF NOT EXISTS analisis_ia JSONB,
  ADD COLUMN IF NOT EXISTS analisis_ia_actualizado_en TIMESTAMPTZ;
