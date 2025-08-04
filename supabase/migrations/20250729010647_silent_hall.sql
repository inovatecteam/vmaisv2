/*
  # Fix RLS policy for user signup

  1. Problem
    - Current INSERT policy only allows 'authenticated' users to insert data
    - During signup, users are still 'anon' role when creating their profile
    - This causes RLS violation error during registration

  2. Solution
    - Drop existing restrictive INSERT policy
    - Create new INSERT policy that allows 'public' role (includes 'anon')
    - Still enforce that users can only insert their own data via auth.uid() check

  3. Security
    - Maintains security by checking auth.uid() = id
    - Allows signup process to complete successfully
    - Users can still only insert data for their own user ID
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new INSERT policy that allows public role (includes anon users during signup)
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);