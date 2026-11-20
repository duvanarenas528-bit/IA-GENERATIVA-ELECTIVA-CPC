ALTER TABLE preperitajes
  ADD COLUMN IF NOT EXISTS analisis_cuestionario JSONB,
  ADD COLUMN IF NOT EXISTS analisis_cuestionario_actualizado_en TIMESTAMPTZ;
