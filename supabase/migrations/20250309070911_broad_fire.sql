/*
  # Applications Table Schema Update

  1. Changes
    - Drop and recreate applications table with proper foreign key relationships
    - Add RLS policies for security
    - Add trigger for updated_at timestamp

  2. Security
    - Enable RLS
    - Add policies for:
      - Post owners can view applications
      - Users can create applications
      - Users can view own applications
      - Users can update own applications

  3. Relationships
    - Foreign key to posts table
    - Foreign key to auth.users table
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS applications CASCADE;

-- Create updated_at trigger function if it doesn't exist
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_applications_post_id ON applications(post_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);