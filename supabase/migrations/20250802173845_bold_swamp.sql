/*
  # Create tarefas (tasks) table

  1. New Tables
    - `tarefas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `titulo` (text, task title)
      - `descricao` (text, task description)
      - `status` (text, task status with check constraint)
      - `data` (date, task date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tarefas` table
    - Add policies for authenticated users to manage their own tasks

  3. Performance
    - Add indexes on user_id, status, and data columns
    - Add trigger for automatic updated_at timestamp
*/

-- Create the tarefas table
CREATE TABLE IF NOT EXISTS tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  descricao text,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
  data date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert own task data"
  ON tarefas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own task data"
  ON tarefas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own task data"
  ON tarefas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own task data"
  ON tarefas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function for updating updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic updated_at timestamp
CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON tarefas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tarefas_user_id_idx ON tarefas(user_id);
CREATE INDEX IF NOT EXISTS tarefas_status_idx ON tarefas(status);
CREATE INDEX IF NOT EXISTS tarefas_data_idx ON tarefas(data);