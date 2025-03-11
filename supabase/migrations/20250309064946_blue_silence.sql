/*
  # Add RLS policies for posts table

  1. Security
    - Enable RLS on posts table
    - Add policies for:
      - Public users can view active posts
      - Authenticated users can:
        - Create posts
        - Update their own posts
        - Delete their own posts
        - View all their own posts (including non-active)

  Note: Added safety checks to prevent duplicate policy errors
*/

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Drop existing policies to ensure clean state
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public users can view active posts" ON posts;
  DROP POLICY IF EXISTS "Users can create posts" ON posts;
  DROP POLICY IF EXISTS "Users can update own posts" ON posts;
  DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
  DROP POLICY IF EXISTS "Users can view all own posts" ON posts;
END $$;

-- Allow public users to view active posts
CREATE POLICY "Public users can view active posts"
ON posts
FOR SELECT
TO public
USING (status = 'active');

-- Allow authenticated users to create posts
CREATE POLICY "Users can create posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update own posts"
ON posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to view all their own posts
CREATE POLICY "Users can view all own posts"
ON posts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);