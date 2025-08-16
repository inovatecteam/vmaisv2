/*
  # Add admin approval system to ONGs

  1. New Column
    - `admin_approved` (boolean, default false) - Admin approval status for ONGs

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new column
    - ONGs will be filtered by admin_approved in application logic

  3. Default Behavior
    - All new ONGs will be admin_approved = false by default
    - Only admin-approved ONGs will appear in the public listings
*/

-- Add admin_approved column to ongs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ongs' AND column_name = 'admin_approved'
  ) THEN
    ALTER TABLE ongs ADD COLUMN admin_approved boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create index for better performance on admin_approved queries
CREATE INDEX IF NOT EXISTS ongs_admin_approved_idx ON ongs(admin_approved);

-- No RLS policy changes needed for new columns, as existing policies
-- for 'ongs' table (public read, user insert/update own) will apply automatically.