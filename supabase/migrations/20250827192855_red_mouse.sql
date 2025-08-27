/*
  # Add 'itinerante' to localizacao_tipo enum

  1. Changes
    - Remove existing CHECK constraint on localizacao_tipo column
    - Add new CHECK constraint that includes 'itinerante' value
    - This allows ONGs to be classified as itinerant (no fixed location)

  2. Security
    - No changes to RLS policies needed
    - Existing policies will cover the new enum value
*/

-- Remove existing CHECK constraint on localizacao_tipo if it exists
DO $$
BEGIN
    -- Check if any CHECK constraint exists on the localizacao_tipo column
    IF EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_attribute a ON a.attnum = ANY(c.conkey)
        WHERE c.conrelid = 'public.ongs'::regclass 
        AND c.contype = 'c' 
        AND a.attname = 'localizacao_tipo'
    ) THEN
        -- Drop the constraint (we'll find its name dynamically)
        EXECUTE (
            SELECT 'ALTER TABLE ongs DROP CONSTRAINT ' || c.conname
            FROM pg_constraint c
            JOIN pg_attribute a ON a.attnum = ANY(c.conkey)
            WHERE c.conrelid = 'public.ongs'::regclass 
            AND c.contype = 'c' 
            AND a.attname = 'localizacao_tipo'
            LIMIT 1
        );
    END IF;
END
$$;

-- Add new CHECK constraint with 'itinerante' value
ALTER TABLE ongs ADD CONSTRAINT ongs_localizacao_tipo_check 
CHECK (localizacao_tipo IN ('presencial', 'online', 'ambos', 'itinerante'));