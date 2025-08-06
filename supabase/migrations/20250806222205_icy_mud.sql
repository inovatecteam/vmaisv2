/*
  # Add new ONG profile fields

  1. New Columns
    - `short_description` (text) - Brief description with character limit
    - `how_to_help` (text) - How volunteers can help, donations needed
    - `additional_categories` (text array) - Multiple categories for the ONG

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new columns
*/

-- Add short_description column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ongs' AND column_name = 'short_description'
  ) THEN
    ALTER TABLE ongs ADD COLUMN short_description text;
  END IF;
END $$;

-- Add how_to_help column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ongs' AND column_name = 'how_to_help'
  ) THEN
    ALTER TABLE ongs ADD COLUMN how_to_help text;
  END IF;
END $$;

-- Add additional_categories column (as text array)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ongs' AND column_name = 'additional_categories'
  ) THEN
    ALTER TABLE ongs ADD COLUMN additional_categories text[];
  END IF;
END $$;

-- No RLS policy changes needed for new columns, as existing policies
-- for 'ongs' table (public read, user insert/update own) will apply automatically.