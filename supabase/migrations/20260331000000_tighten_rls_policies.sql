-- Tighten RLS policies for security audit
-- Previous "Users can read public data" policy on users table was too permissive:
-- any authenticated user could read ALL fields (phone, email, location) of ALL users.

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can read public data" ON users;

-- Users can read their own full profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Drop overly permissive ongs SELECT policy and add admin_approved check
DROP POLICY IF EXISTS "ONGs are publicly readable" ON ongs;
DROP POLICY IF EXISTS "Anyone can view approved ONGs" ON ongs;

CREATE POLICY "Anyone can view approved ONGs"
  ON ongs
  FOR SELECT
  TO public
  USING (admin_approved = true);

-- ONG owners can also see their own (even if not approved yet)
CREATE POLICY "ONG owners can view own ONGs"
  ON ongs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
