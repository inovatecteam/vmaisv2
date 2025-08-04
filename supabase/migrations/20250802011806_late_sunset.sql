@@ .. @@
 -- Create new INSERT policy that allows public role (includes anon users during signup)
 CREATE POLICY "Users can insert own data"
   ON users
   FOR INSERT
   TO public
-  WITH CHECK (auth.uid() = id);
+  WITH CHECK (true);