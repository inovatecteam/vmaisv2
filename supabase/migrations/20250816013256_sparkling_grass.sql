/*
  # Add doacoes column to ongs table

  1. New Column
    - `doacoes` (text, optional) - Information about donations needed by the organization

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
*/

-- Add doacoes column to ongs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ongs' AND column_name = 'doacoes'
  ) THEN
    ALTER TABLE ongs ADD COLUMN doacoes text;
  END IF;
END $$;

-- No RLS policy changes needed for new columns, as existing policies
-- for 'ongs' table (public read, user insert/update own) will apply automatically.