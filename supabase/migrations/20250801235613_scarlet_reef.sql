/*
  # Create ongs table

  1. New Tables
    - `ongs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `nome` (text, not null) - organization name
      - `tipo` (text, not null) - organization type
      - `descricao` (text, not null) - organization description
      - `cidade` (text, not null) - city
      - `estado` (text, not null) - state
      - `necessidades` (text array, optional) - volunteer needs
      - `whatsapp` (text, optional) - WhatsApp contact
      - `thumbnail_url` (text, optional) - organization image
      - `lat` (numeric, optional) - latitude for map
      - `lng` (numeric, optional) - longitude for map
      - `created_at` (timestamptz) - creation timestamp
      - `updated_at` (timestamptz) - last update timestamp

  2. Security
    - Enable RLS on `ongs` table
    - Add policy for public read access
    - Add policy for users to insert their own ong data
    - Add policy for users to update their own ong data

  3. Indexes
    - Add indexes for better performance on common queries
*/

-- Create ongs table
CREATE TABLE IF NOT EXISTS ongs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  tipo text NOT NULL,
  descricao text NOT NULL,
  cidade text NOT NULL,
  estado text NOT NULL,
  necessidades text[],
  whatsapp text,
  thumbnail_url text,
  lat numeric,
  lng numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ongs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "ONGs are publicly readable"
  ON ongs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own ONG data"
  ON ongs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ONG data"
  ON ongs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ongs_updated_at
  BEFORE UPDATE ON ongs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS ongs_user_id_idx ON ongs(user_id);
CREATE INDEX IF NOT EXISTS ongs_tipo_idx ON ongs(tipo);
CREATE INDEX IF NOT EXISTS ongs_estado_idx ON ongs(estado);
CREATE INDEX IF NOT EXISTS ongs_cidade_idx ON ongs(cidade);
CREATE INDEX IF NOT EXISTS ongs_created_at_idx ON ongs(created_at);
CREATE INDEX IF NOT EXISTS ongs_lat_lng_idx ON ongs(lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;