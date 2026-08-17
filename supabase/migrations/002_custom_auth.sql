-- 002_custom_auth.sql
-- Adds custom auth: password_hash on profiles, check_password RPC, seed admin user
-- Completely bypasses Supabase Auth which doesn't work with sb_publishable_ keys

-- Enable pgcrypto for bcrypt
create extension if not exists "pgcrypto";

-- Add columns to profiles
alter table public.profiles add column if not exists password_hash text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists is_admin boolean default false;

-- Function to verify password (takes plaintext + stored bcrypt hash, returns bool)
create or replace function public.check_password(p_password text, p_hash text)
returns boolean
language plpgsql
security definer
as $$
begin
  return p_hash = crypt(p_password, p_hash);
end;
$$;

-- Upsert admin user (profile row with bcrypt hash of "P@IPet2026")
-- First get or create the auth user reference
do $$
DECLARE
  admin_id uuid;
  admin_hash text;
begin
  -- Generate the bcrypt hash
  admin_hash := crypt('P@IPet2026', gen_salt('bf', 10));

  -- Try to find existing profile for oktagram
  SELECT id INTO admin_id FROM public.profiles WHERE username = 'oktagram';

  IF admin_id IS NULL THEN
    -- Create a new UUID for the admin (no auth.users dependency)
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
end;
$$;

-- Grant execute on the function
grant execute on function public.check_password(text, text) to anon;
grant execute on function public.check_password(text, text) to authenticated;
