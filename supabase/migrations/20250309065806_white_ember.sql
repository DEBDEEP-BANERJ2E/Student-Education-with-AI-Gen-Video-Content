/*
  # Add applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references users)
      - `status` (text, check constraint: pending/accepted/rejected/completed)
      - `message` (text)
      - `resume_url` (text, nullable)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on applications table
    - Add policies for:
      - Post owners can view applications
      - Users can create applications
      - Users can view own applications
*/

-- Create applications table if it doesn't exist
DO $$ BEGIN
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
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Drop existing policies to ensure clean state
DO $$ BEGIN
  DROP POLICY IF EXISTS "Post owners can view applications" ON applications;
  DROP POLICY IF EXISTS "Users can create applications" ON applications;
  DROP POLICY IF EXISTS "Users can view own applications" ON applications;
END $$;

-- Create new policies
DO $$ BEGIN
  -- Post owners can view applications for their posts
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

  -- Users can create applications
  CREATE POLICY "Users can create applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

  -- Users can view their own applications
  CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
END $$;