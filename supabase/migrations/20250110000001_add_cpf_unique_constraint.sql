/*
  # Add unique constraint for CPF in blood_donation_registrations

  1. Schema Changes
    - Add unique constraint on CPF field to prevent duplicate registrations
    - This ensures database-level protection against duplicate CPF entries
*/

-- Add unique constraint on CPF field
ALTER TABLE blood_donation_registrations 
ADD CONSTRAINT unique_cpf_blood_donation 
UNIQUE (cpf);
