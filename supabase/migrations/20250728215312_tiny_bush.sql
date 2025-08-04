/*
  # Create users table and related schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users.id
      - `email` (text, unique, not null)
      - `nome` (text, not null) - user's full name
      - `tipo` (text, not null) - 'voluntario' or 'ong'
      - `telefone` (text, optional) - phone number
      - `bio` (text, optional) - user description
      - `created_at` (timestamptz) - creation timestamp
      - `updated_at` (timestamptz) - last update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for users to insert their own data
    - Add policy for users to update their own data
    - Add policy for authenticated users to read other users' public data

  3. Functions
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('voluntario', 'ong')),
  telefone text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read public data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_tipo_idx ON users(tipo);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);