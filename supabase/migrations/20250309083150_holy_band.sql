/*
  # Add video URL to posts table

  1. Changes
    - Add video_url column to posts table for storing course video URLs
*/

ALTER TABLE posts
ADD COLUMN video_url text DEFAULT NULL;