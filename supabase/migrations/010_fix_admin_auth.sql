-- 010_fix_admin_auth.sql
-- Fixes admin login by removing auth.users FK constraint on profiles,
-- adding auth columns, creating check_password RPC, and seeding admin.

-- 1. Drop the FK constraint on profiles.id → auth.users(id)
-- (We use custom auth, not Supabase Auth, so we don't need this FK)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;

-- 2. Also drop the trigger/function that depends on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Add auth columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean default false;

-- 4. Enable pgcrypto for bcrypt
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 5. Create check_password RPC function
CREATE OR REPLACE FUNCTION public.check_password(p_password text, p_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN p_hash = crypt(p_password, p_hash);
END;
$$;

-- 6. Grant execute on the function
GRANT EXECUTE ON FUNCTION public.check_password(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_password(text, text) TO authenticated;

-- 7. Upsert admin user
DO $$
DECLARE
  admin_id uuid;
  admin_hash text;
BEGIN
  admin_hash := crypt('P@IPet2026', gen_salt('bf', 10));

  SELECT id INTO admin_id FROM public.profiles WHERE username = 'oktagram';

  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO public.profiles (id, username, email, is_admin, password_hash)
    VALUES (admin_id, 'oktagram', 'oktagram@webutama.local', true, admin_hash);
  ELSE
    UPDATE public.profiles
    SET password_hash = admin_hash,
        email = 'oktagram@webutama.local',
        is_admin = true
    WHERE username = 'oktagram';
  END IF;
END $$;

-- 8. Fix RLS policies for profiles (allow service role inserts)
-- The service role bypasses RLS anyway, but just in case:
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR id IN (SELECT id FROM public.profiles WHERE is_admin = true));
