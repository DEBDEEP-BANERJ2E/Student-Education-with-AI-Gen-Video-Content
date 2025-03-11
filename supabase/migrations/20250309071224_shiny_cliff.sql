/*
  # Fix Applications Table Schema

  1. Changes
    - Drop and recreate applications table with proper foreign key relationships
    - Add proper indexes for performance
    - Update RLS policies
    - Add user relationship for proper joins

  2. Security
    - Maintain RLS policies
    - Ensure proper access control
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS applications CASCADE;

-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create applications table
CREATE TABLE applications (
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
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create policies
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

CREATE POLICY "Users can create applications"
ON applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own applications"
ON applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
ON applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_applications_post_id ON applications(post_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Create foreign key relationship for auth.users
COMMENT ON COLUMN applications.user_id IS E'@foreignKey (auth.users) REFERENCES auth.users(id) ON DELETE CASCADE';