/*
  # Add horario_selecionado to blood_donation_registrations

  1. Schema Changes
    - Add `horario_selecionado` (text) - Selected time slot for blood donation
      - Format: "24-8h-9h", "24-9h-10h", "24-10h-11h", "24-11h-12h"
      - Format: "25-8h-9h", "25-9h-10h", "25-10h-11h", "25-11h-12h"
      - NOT NULL constraint to ensure a time slot is always selected
*/

ALTER TABLE blood_donation_registrations 
ADD COLUMN horario_selecionado text NOT NULL DEFAULT '';

-- Update existing records to have a default value (if any exist)
UPDATE blood_donation_registrations 
SET horario_selecionado = '24-8h-9h' 
WHERE horario_selecionado = '';

-- Add a check constraint to ensure valid time slot format
ALTER TABLE blood_donation_registrations 
ADD CONSTRAINT check_horario_selecionado_format 
CHECK (horario_selecionado ~ '^(24|25)-(8h-9h|9h-10h|10h-11h|11h-12h)$');
