-- This script creates the admin profile after the user signs up via Supabase Auth
-- Run this AFTER signing up with email: raselshikdar597@gmail.com

-- First, get the user ID from auth.users and create/update their profile
INSERT INTO profiles (id, email, full_name, is_admin, bio)
SELECT 
  id,
  email,
  'Rasel Shikdar',
  true,
  'Full-stack developer passionate about building exceptional digital experiences.'
FROM auth.users
WHERE email = 'raselshikdar597@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  full_name = 'Rasel Shikdar',
  bio = 'Full-stack developer passionate about building exceptional digital experiences.',
  updated_at = NOW();
