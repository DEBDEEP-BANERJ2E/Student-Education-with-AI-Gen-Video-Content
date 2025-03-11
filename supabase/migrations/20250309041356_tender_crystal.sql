/*
  # Create Posts and Related Tables

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `organization` (text)
      - `description` (text)
      - `requirements` (text)
      - `location` (text, nullable)
      - `type` (text) - 'jobs', 'internships', 'courses', 'scholarships', 'projects'
      - `work_type` (text, nullable) - 'remote', 'onsite', 'hybrid'
      - `duration` (text, nullable)
      - `compensation` (text, nullable)
      - `skills` (text[])
      - `status` (text) - 'active', 'closed', 'draft'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `applications`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references auth.users)
      - `status` (text) - 'pending', 'accepted', 'rejected', 'completed'
      - `message` (text)
      - `resume_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  organization text NOT NULL,
  description text NOT NULL,
  requirements text,
  location text,
  type text NOT NULL CHECK (type IN ('jobs', 'internships', 'courses', 'scholarships', 'projects')),
  work_type text CHECK (work_type IN ('remote', 'onsite', 'hybrid')),
  duration text,
  compensation text,
  skills text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  message text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Anyone can view active posts"
  ON posts
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can create posts"
  ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Post owners can view applications for their posts"
  ON applications
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM posts WHERE posts.id = applications.post_id AND posts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create applications"
  ON applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX posts_type_idx ON posts(type);
CREATE INDEX posts_status_idx ON posts(status);
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX applications_post_id_idx ON applications(post_id);
CREATE INDEX applications_user_id_idx ON applications(user_id);
CREATE INDEX applications_status_idx ON applications(status);