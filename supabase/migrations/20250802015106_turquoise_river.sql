/*
  # Create interacoes table with proper relationships

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

  4. Foreign Key Constraints
    - Proper foreign key relationship between interacoes.ong_id and ongs.id
    - Proper foreign key relationship between interacoes.user_id and users.id
*/

-- Drop table if it exists to recreate with proper constraints
DROP TABLE IF EXISTS interacoes;

-- Create interacoes table with proper foreign key constraints
CREATE TABLE interacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ong_id uuid NOT NULL,
  timestamp timestamptz DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_interacoes_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_interacoes_ong_id 
    FOREIGN KEY (ong_id) 
    REFERENCES ongs(id) 
    ON DELETE CASCADE
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
CREATE INDEX interacoes_user_id_idx ON interacoes(user_id);
CREATE INDEX interacoes_ong_id_idx ON interacoes(ong_id);
CREATE INDEX interacoes_timestamp_idx ON interacoes(timestamp);
CREATE INDEX interacoes_user_timestamp_idx ON interacoes(user_id, timestamp DESC);

-- Refresh the PostgREST schema cache by toggling RLS
ALTER TABLE interacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE interacoes ENABLE ROW LEVEL SECURITY;