/*
  # Add additional fields to users table

  1. Changes
    - Add `foto` column to store user profile picture URL
    - Add `interesses` column to store user interests as text array
    - Add `disponibilidade` column to store user availability
    - Add `localizacao` column to store user location

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new columns
*/

-- Add missing columns to users table
DO $$
BEGIN
  -- Add foto column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'foto'
  ) THEN
    ALTER TABLE users ADD COLUMN foto text;
  END IF;

  -- Add interesses column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'interesses'
  ) THEN
    ALTER TABLE users ADD COLUMN interesses text[];
  END IF;

  -- Add disponibilidade column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'disponibilidade'
  ) THEN
    ALTER TABLE users ADD COLUMN disponibilidade text;
  END IF;

  -- Add localizacao column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'localizacao'
  ) THEN
    ALTER TABLE users ADD COLUMN localizacao text;
  END IF;
END $$;