-- This script sets up the admin user after they sign up through the auth flow
-- First, the user needs to sign up at /auth/signup with:
-- Email: raselshikdar597@gmail.com
-- Password: Ab52639479@

-- After sign up and email confirmation, run this to grant admin privileges:
-- This updates the profile to set is_admin = true

UPDATE profiles 
SET is_admin = true, 
    full_name = 'Rasel Shikdar',
    bio = 'Full-Stack Developer & Creator'
WHERE email = 'raselshikdar597@gmail.com';

-- If the profile doesn't exist yet, insert it (after user signs up)
INSERT INTO profiles (id, email, full_name, bio, is_admin)
SELECT 
  id,
  email,
  'Rasel Shikdar',
  'Full-Stack Developer & Creator',
  true
FROM auth.users 
WHERE email = 'raselshikdar597@gmail.com'
ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  full_name = 'Rasel Shikdar',
  bio = 'Full-Stack Developer & Creator';
