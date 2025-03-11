/*
  # Applications Table Schema

  1. New Tables
    - applications
      - id (uuid, primary key)
      - post_id (uuid, references posts)
      - user_id (uuid, references auth.users)
      - status (text)
      - message (text)
      - resume_url (text, optional)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on applications table
    - Add policies for:
      - Post owners can view applications
      - Users can create applications
      - Users can view own applications
      - Users can update own applications

  3. Triggers
    - Add updated_at trigger
*/

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  message text NOT NULL,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT applications_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'completed'))
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create policies (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' 
    AND policyname = 'Post owners can view applications'
  ) THEN
    CREATE POLICY "Post owners can view applications"
    ON applications
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM posts 
        WHERE posts.id = applications.post_id 
        AND posts.user_id = auth.uid()
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' 
    AND policyname = 'Users can create applications'
  ) THEN
    CREATE POLICY "Users can create applications"
    ON applications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' 
    AND policyname = 'Users can view own applications'
  ) THEN
    CREATE POLICY "Users can view own applications"
    ON applications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' 
    AND policyname = 'Users can update own applications'
  ) THEN
    CREATE POLICY "Users can update own applications"
    ON applications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;