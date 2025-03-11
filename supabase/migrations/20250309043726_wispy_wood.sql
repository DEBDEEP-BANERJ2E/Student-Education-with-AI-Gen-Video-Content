/*
  # Add Applications Table and Relations

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references auth.users)
      - `status` (text, enum: pending/accepted/rejected/completed)
      - `message` (text)
      - `resume_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on applications table
    - Add policies for:
      - Post owners can view applications for their posts
      - Users can create applications
      - Users can update their own applications
      - Users can view their own applications

  3. Changes
    - Add foreign key relationships
    - Add indexes for performance
*/

-- Create applications table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'applications'
  ) THEN
    CREATE TABLE applications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
      message text,
      resume_url text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Create trigger for applications
    CREATE TRIGGER update_applications_updated_at
      BEFORE UPDATE ON applications
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();

    -- Enable RLS
    ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

    -- Create policies
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

    -- Create indexes
    CREATE INDEX applications_post_id_idx ON applications(post_id);
    CREATE INDEX applications_user_id_idx ON applications(user_id);
    CREATE INDEX applications_status_idx ON applications(status);
  END IF;
END
$$;