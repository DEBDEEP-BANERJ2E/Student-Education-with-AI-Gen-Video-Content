/*
  # Fix Applications User Relations

  1. Changes
    - Add proper foreign key relationship between applications and auth.users
    - Update RLS policies to use auth.uid()
    - Ensure applications can access user data through auth.users

  2. Security
    - Maintain RLS policies with proper user verification
    - Ensure secure access to user data
*/

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Ensure the foreign key exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'applications_user_id_fkey'
  ) THEN
    ALTER TABLE applications
    ADD CONSTRAINT applications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Update RLS policies
DROP POLICY IF EXISTS "Post owners can view applications for their posts" ON applications;
DROP POLICY IF EXISTS "Users can create applications" ON applications;
DROP POLICY IF EXISTS "Users can update own applications" ON applications;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;

CREATE POLICY "Post owners can view applications for their posts"
  ON applications
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = applications.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create applications"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);