/*
  # Update profiles table with additional fields

  1. Changes
    - Add new columns for additional profile information:
      - age (integer)
      - gender (text)
      - work_environment (text)
      - education (jsonb array)
      - experience (jsonb array)
      - skills (jsonb)
      - projects (jsonb array)
      - certifications (jsonb array)

  2. Security
    - Maintain existing RLS policies
    - Add default values where appropriate
*/

-- Add new columns to profiles table
DO $$ 
BEGIN
  -- Basic Information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'work_environment'
  ) THEN
    ALTER TABLE profiles ADD COLUMN work_environment text DEFAULT 'remote';
  END IF;

  -- Education
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'education'
  ) THEN
    ALTER TABLE profiles ADD COLUMN education jsonb[] DEFAULT '{}';
  END IF;

  -- Work Experience
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'experience'
  ) THEN
    ALTER TABLE profiles ADD COLUMN experience jsonb[] DEFAULT '{}';
  END IF;

  -- Skills
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'skills'
  ) THEN
    ALTER TABLE profiles ADD COLUMN skills jsonb DEFAULT '{"technical": [], "soft": [], "languages": []}';
  END IF;

  -- Projects
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'projects'
  ) THEN
    ALTER TABLE profiles ADD COLUMN projects jsonb[] DEFAULT '{}';
  END IF;

  -- Certifications
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'certifications'
  ) THEN
    ALTER TABLE profiles ADD COLUMN certifications jsonb[] DEFAULT '{}';
  END IF;

END $$;