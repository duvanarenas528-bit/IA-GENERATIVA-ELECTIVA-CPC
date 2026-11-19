ALTER TABLE preperitajes
  ADD COLUMN IF NOT EXISTS mantenimiento JSONB DEFAULT '{}'::jsonb;
