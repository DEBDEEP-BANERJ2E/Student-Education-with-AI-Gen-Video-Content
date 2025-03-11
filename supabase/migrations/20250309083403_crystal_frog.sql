/*
  # Create videos storage bucket

  1. Changes
    - Create a new storage bucket for course videos
    - Set up public access policies
*/

-- Create the videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Allow authenticated users to upload videos
CREATE POLICY "Allow authenticated users to upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Allow public access to videos
CREATE POLICY "Allow public to view videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');