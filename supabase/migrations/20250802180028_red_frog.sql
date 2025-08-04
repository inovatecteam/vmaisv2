/*
  # Fix RLS policy for users table

  1. Security Changes
    - Update INSERT policy to properly check user ID
    - Ensure users can only insert their own data
    - Maintain security while allowing signup

  2. Policy Updates
    - Change WITH CHECK clause to validate auth.uid() = id
    - Keep policy secure but functional for new user registration
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new INSERT policy with proper security check
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);