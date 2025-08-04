/*
  # Create interacoes table

  1. New Tables
    - `interacoes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users.id)
      - `ong_id` (uuid, foreign key to ongs.id)
      - `timestamp` (timestamptz) - interaction timestamp

  2. Security
    - Enable RLS on `interacoes` table
    - Add policy for users to insert their own interaction data
    - Add policy for users to select their own interaction data

  3. Indexes
    - Add indexes for better performance on common queries
*/

-- Create interacoes table
CREATE TABLE IF NOT EXISTS interacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  ong_id uuid REFERENCES ongs(id) ON DELETE CASCADE NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE interacoes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own interaction data"
  ON interacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own interaction data"
  ON interacoes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS interacoes_user_id_idx ON interacoes(user_id);
CREATE INDEX IF NOT EXISTS interacoes_ong_id_idx ON interacoes(ong_id);
CREATE INDEX IF NOT EXISTS interacoes_timestamp_idx ON interacoes(timestamp);
CREATE INDEX IF NOT EXISTS interacoes_user_timestamp_idx ON interacoes(user_id, timestamp DESC);