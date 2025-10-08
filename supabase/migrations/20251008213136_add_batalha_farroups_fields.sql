/*
  # Add Batalha dos Farroups fields to blood_donation_registrations

  1. Schema Changes
    - Add `participando_batalha` (text) - Whether participating in Batalha dos Farroups
      - Values: 'não' (default) or 'sim'
      - NOT NULL constraint
    - Add `turma_batalha` (text) - Selected class for Batalha dos Farroups
      - Values: '9A', '9B', '9C', '9D', '9E', '9F' or empty string
      - Can be NULL when not participating
*/

ALTER TABLE blood_donation_registrations 
ADD COLUMN participando_batalha text NOT NULL DEFAULT 'não';

ALTER TABLE blood_donation_registrations 
ADD COLUMN turma_batalha text;

-- Add check constraint for participando_batalha
ALTER TABLE blood_donation_registrations 
ADD CONSTRAINT check_participando_batalha 
CHECK (participando_batalha IN ('não', 'sim'));

-- Add check constraint for turma_batalha
ALTER TABLE blood_donation_registrations 
ADD CONSTRAINT check_turma_batalha 
CHECK (turma_batalha IS NULL OR turma_batalha IN ('9A', '9B', '9C', '9D', '9E', '9F'));

-- Update existing records to have default value
UPDATE blood_donation_registrations 
SET participando_batalha = 'não' 
WHERE participando_batalha IS NULL;
