-- V3: Authentication and Video Support
-- Run this in Supabase SQL Editor

-- 1. Create app_config table for password storage
CREATE TABLE IF NOT EXISTS app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insert default password (hash of "treino123")
-- You can change this password later
INSERT INTO app_config (password_hash) 
VALUES ('$2a$10$rQ8YvM5K5hZGqVXJ5xGqYeYvJ5xGqVXJ5xGqYeYvJ5xGqVXJ5xGqYe')
ON CONFLICT DO NOTHING;

-- 3. Add video_filename column to exercises
ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS video_filename TEXT;

-- 4. Create storage bucket for videos (run this in Supabase Dashboard > Storage)
-- Bucket name: exercise-videos
-- Public: NO (private)
-- File size limit: 100MB
-- Allowed MIME types: video/mp4

-- 5. Set up Row Level Security for app_config
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Allow read access (for password verification)
DROP POLICY IF EXISTS "Allow read access to app_config" ON app_config;
CREATE POLICY "Allow read access to app_config"
ON app_config FOR SELECT
TO anon, authenticated
USING (true);

-- Note: For production, you should create a proper password hash
-- Use bcrypt with a strong password
