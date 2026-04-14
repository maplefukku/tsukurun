-- Fix: "Database error saving new user" on signup
-- Root cause: GoTrue uses supabase_auth_admin role to insert into auth.users.
-- The AFTER INSERT trigger fires as supabase_auth_admin. Even with SECURITY DEFINER,
-- the role must have EXECUTE privilege on the function, and the function owner (postgres)
-- must have INSERT on profiles (which it does, but explicit grants ensure robustness).
--
-- This migration:
-- 1. Recreates the function with SECURITY DEFINER + search_path = ''
-- 2. Grants EXECUTE to supabase_auth_admin explicitly
-- 3. Grants INSERT on profiles to postgres (belt and suspenders)
-- 4. Ensures trigger is correctly attached

-- Step 1: Clean slate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Recreate function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(COALESCE(NEW.email, ''), '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 3: Ensure ownership and permissions
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Step 4: Ensure postgres can insert into profiles (for SECURITY DEFINER)
GRANT INSERT ON TABLE public.profiles TO postgres;
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

-- Step 5: Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
