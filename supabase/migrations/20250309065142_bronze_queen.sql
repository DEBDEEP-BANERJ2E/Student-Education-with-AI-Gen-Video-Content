/*
  # Fix posts table constraints and policies

  1. Constraints
    - Safely add check constraints for status, type, and work_type fields
    - Use DO blocks to handle existing constraints

  2. Security
    - Ensure RLS is enabled
    - Recreate policies with proper checks
*/

-- Safely add check constraints
DO $$ 
BEGIN
  -- Drop existing constraints if they exist
  ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_status_check;
  ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_type_check;
  ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_work_type_check;

  -- Add constraints
  ALTER TABLE posts 
    ADD CONSTRAINT posts_status_check 
    CHECK (status IN ('active', 'closed', 'draft', 'completed'));

  ALTER TABLE posts 
    ADD CONSTRAINT posts_type_check 
    CHECK (type IN ('jobs', 'internships', 'courses', 'scholarships', 'projects'));

  ALTER TABLE posts 
    ADD CONSTRAINT posts_work_type_check 
    CHECK (work_type IN ('remote', 'onsite', 'hybrid'));
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Drop existing policies to ensure clean state
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public users can view active posts" ON posts;
  DROP POLICY IF EXISTS "Users can create posts" ON posts;
  DROP POLICY IF EXISTS "Users can update own posts" ON posts;
  DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
  DROP POLICY IF EXISTS "Users can view all own posts" ON posts;
END $$;

-- Create policies
CREATE POLICY "Public users can view active posts"
ON posts
FOR SELECT
TO public
USING (status = 'active');

CREATE POLICY "Users can create posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
ON posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view all own posts"
ON posts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);