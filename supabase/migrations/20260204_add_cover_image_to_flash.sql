-- Migration to add cover_image to flash_info table
ALTER TABLE IF EXISTS flash_info 
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Update RLS if necessary (usually not needed if already allowed)
-- ALTER POLICY "Enable all for authenticated" ON flash_info USING (true) WITH CHECK (true);
