/*
  # Update horario_selecionado constraint for 30 October

  1. Schema Changes
    - Remove old constraint that expects 24/25 October format
    - Add new constraint that expects 30 October format
    - Update existing records to use new format
*/

-- Remove the old constraint
ALTER TABLE blood_donation_registrations 
DROP CONSTRAINT IF EXISTS check_horario_selecionado_format;

-- Update existing records to use 30 October format
UPDATE blood_donation_registrations 
SET horario_selecionado = REPLACE(REPLACE(horario_selecionado, '24-', '30-'), '25-', '30-')
WHERE horario_selecionado LIKE '24-%' OR horario_selecionado LIKE '25-%';

-- Add new constraint for 30 October format
ALTER TABLE blood_donation_registrations 
ADD CONSTRAINT check_horario_selecionado_format 
CHECK (horario_selecionado ~ '^30-(8h-9h|9h-10h|10h-11h|11h-12h)$');
