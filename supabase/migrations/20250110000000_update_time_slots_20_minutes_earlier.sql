/*
  # Update time slots to be 20 minutes earlier

  1. Schema Changes
    - Remove old constraint that expects 8h-9h format
    - Add new constraint that expects 7h40-8h40 format
    - Update existing records to use new format
*/

-- Remove the old constraint
ALTER TABLE blood_donation_registrations 
DROP CONSTRAINT IF EXISTS check_horario_selecionado_format;

-- Update existing records to use new time format (20 minutes earlier)
UPDATE blood_donation_registrations 
SET horario_selecionado = CASE 
  WHEN horario_selecionado = '30-8h-9h' THEN '30-7h40-8h40'
  WHEN horario_selecionado = '30-9h-10h' THEN '30-8h40-9h40'
  WHEN horario_selecionado = '30-10h-11h' THEN '30-9h40-10h40'
  WHEN horario_selecionado = '30-11h-12h' THEN '30-10h40-11h40'
  ELSE horario_selecionado
END
WHERE horario_selecionado IN ('30-8h-9h', '30-9h-10h', '30-10h-11h', '30-11h-12h');

-- Add new constraint for updated time format
ALTER TABLE blood_donation_registrations 
ADD CONSTRAINT check_horario_selecionado_format 
CHECK (horario_selecionado ~ '^30-(7h40-8h40|8h40-9h40|9h40-10h40|10h40-11h40)$');
