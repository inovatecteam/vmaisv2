/*
  # Add onboarded column to users table

  1. Changes
    - Add `onboarded` column to `users` table (BOOLEAN, default FALSE)
    - This column tracks whether the user has completed the onboarding process

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
*/

-- Add onboarded column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'onboarded'
  ) THEN
    ALTER TABLE users ADD COLUMN onboarded boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create index for better performance on onboarded queries
CREATE INDEX IF NOT EXISTS users_onboarded_idx ON users(onboarded);