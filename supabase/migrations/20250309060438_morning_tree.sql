/*
  # Update Applications Policies

  1. Changes
    - Update RLS policies for applications table to use auth.uid()
    - Ensure proper access control for applications

  2. Security
    - Maintain existing RLS policies with improved security
    - Use auth.uid() for user verification
*/

-- First check if the foreign key exists and if not, create it
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