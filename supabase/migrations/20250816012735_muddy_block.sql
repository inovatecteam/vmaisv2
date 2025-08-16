/*
  # Add endereco_fisico column to ongs table

  1. New Column
    - `endereco_fisico` (text, optional) - Physical address of the organization

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
*/

-- Add endereco_fisico column to ongs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ongs' AND column_name = 'endereco_fisico'
  ) THEN
    ALTER TABLE ongs ADD COLUMN endereco_fisico text;
  END IF;
END $$;

-- No RLS policy changes needed for new columns, as existing policies
-- for 'ongs' table (public read, user insert/update own) will apply automatically.