/*
  # Add horarios_funcionamento to ongs table

  1. Changes
    - Add `horarios_funcionamento` column to `ongs` table
    - This will store operating hours information for organizations

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
*/

-- Add horarios_funcionamento column to ongs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ongs' AND column_name = 'horarios_funcionamento'
  ) THEN
    ALTER TABLE ongs ADD COLUMN horarios_funcionamento text;
  END IF;
END $$;