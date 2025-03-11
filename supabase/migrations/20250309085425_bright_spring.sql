/*
  # Add video purchases tracking

  1. New Tables
    - `video_purchases`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on video_purchases table
    - Add policies for authenticated users to view and create purchases
*/

-- Create video purchases table
CREATE TABLE IF NOT EXISTS video_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE video_purchases ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view their purchases
CREATE POLICY "Users can view video purchases"
  ON video_purchases
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to create purchases
CREATE POLICY "Users can create video purchases"
  ON video_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);