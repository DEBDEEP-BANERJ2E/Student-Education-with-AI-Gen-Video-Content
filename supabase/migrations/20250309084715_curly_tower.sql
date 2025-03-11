/*
  # Create storage bucket for course videos

  1. New Storage Bucket
    - Creates a public bucket for course videos
    - Sets appropriate permissions and policies
    - Configures storage settings

  2. Security
    - Enables RLS
    - Adds policies for authenticated users to upload videos
    - Adds policies for public access to download videos
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-videos',
  'course-videos',
  true,
  104857600, -- 100MB in bytes
  ARRAY['video/mp4', 'video/webm']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload videos
CREATE POLICY "Users can upload course videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-videos' AND
  owner = auth.uid()
);

-- Create policy to allow anyone to download videos
CREATE POLICY "Anyone can download course videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-videos');

-- Create policy to allow owners to delete their videos
CREATE POLICY "Users can delete own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-videos' AND
  owner = auth.uid()
);

-- Create policy to allow owners to update their videos
CREATE POLICY "Users can update own videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-videos' AND
  owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'course-videos' AND
  owner = auth.uid()
);