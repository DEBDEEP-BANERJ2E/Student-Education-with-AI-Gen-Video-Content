/*
  # Fix Applications Schema

  1. Changes
    - Drop existing policies to recreate them
    - Add missing indexes and constraints
    - Update RLS policies with correct user references

  2. Security
    - Enable RLS
    - Add policies for post owners and applicants
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Post owners can view applications for their posts" ON applications;
  DROP POLICY IF EXISTS "Users can create applications" ON applications;
  DROP POLICY IF EXISTS "Users can update own applications" ON applications;
  DROP POLICY IF EXISTS "Users can view own applications" ON applications;
END $$;

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create new policies
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

-- Create or update indexes
CREATE INDEX IF NOT EXISTS applications_post_id_idx ON applications(post_id);
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON applications(user_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);