/*
  # Blood Donation Campaign Registrations

  1. New Tables
    - `blood_donation_registrations`
      - `id` (uuid, primary key) - Unique identifier for each registration
      - `nome_completo` (text) - Full name of the donor
      - `data_nascimento` (date) - Date of birth
      - `cpf` (text) - CPF formatted as xxx.xxx.xxx-xx
      - `endereco` (text) - Address
      - `telefone` (text) - Phone number
      - `email` (text) - Email address
      - `nome_mae` (text) - Mother's name
      - `nome_pai` (text) - Father's name
      - `observacoes` (text, nullable) - Optional observations
      - `created_at` (timestamptz) - Registration timestamp

  2. Security
    - Enable RLS on `blood_donation_registrations` table
    - Add policy for public insert (allows non-authenticated users to register)
    - Add policy for authenticated users to view all registrations (admin access)
*/

CREATE TABLE IF NOT EXISTS blood_donation_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_completo text NOT NULL,
  data_nascimento date NOT NULL,
  cpf text NOT NULL,
  endereco text NOT NULL,
  telefone text NOT NULL,
  email text NOT NULL,
  nome_mae text NOT NULL,
  nome_pai text NOT NULL,
  observacoes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blood_donation_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for blood donation"
  ON blood_donation_registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view registrations"
  ON blood_donation_registrations
  FOR SELECT
  TO authenticated
  USING (true);