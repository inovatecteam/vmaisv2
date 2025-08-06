/*
  # Convert ONG tipo field to array

  1. Changes
    - Alter the 'tipo' column in the 'ongs' table to be an array of text
    - Convert existing single values to arrays with one element
    - Maintain NOT NULL constraint

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the modified column
*/

-- Alter the 'tipo' column in the 'ongs' table to be an array of text
ALTER TABLE ongs
ALTER COLUMN tipo TYPE text[] USING ARRAY[tipo];

-- Ensure the column remains NOT NULL if it was originally defined as such
-- (Based on previous migrations, it was NOT NULL)
ALTER TABLE ongs ALTER COLUMN tipo SET NOT NULL;

-- Note: If there were any CHECK constraints on the 'tipo' column that
-- restricted it to a single value, they would need to be dropped here.
-- However, based on the provided migrations, no such constraint exists
-- directly on the 'tipo' column of the 'ongs' table.