-- ============================================================
-- Supabase Dashboard SQL Editor: signup debug queries
-- Run each section separately in the SQL Editor
-- ============================================================

-- 1. Check if handle_new_user function exists and its properties
SELECT
  p.proname AS function_name,
  n.nspname AS schema,
  pg_get_userbyid(p.proowner) AS owner,
  p.prosecdef AS security_definer,
  p.proconfig AS config,
  pg_get_functiondef(p.oid) AS full_definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'handle_new_user';

-- 2. Check if the trigger exists on auth.users
SELECT
  t.tgname AS trigger_name,
  t.tgenabled AS enabled,
  -- O = origin and local, D = disabled, R = replica, A = always
  CASE t.tgenabled
    WHEN 'O' THEN 'enabled (origin)'
    WHEN 'D' THEN 'DISABLED'
    WHEN 'R' THEN 'replica only'
    WHEN 'A' THEN 'always'
    ELSE t.tgenabled::text
  END AS enabled_status,
  p.proname AS function_name,
  pg_get_userbyid(p.proowner) AS function_owner,
  n.nspname AS function_schema
FROM pg_trigger t
JOIN pg_proc p ON p.oid = t.tgfoid
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE t.tgrelid = 'auth.users'::regclass
ORDER BY t.tgname;

-- 3. Check profiles table structure and constraints
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Check RLS policies on profiles
SELECT
  polname AS policy_name,
  polcmd AS command,
  CASE polcmd
    WHEN 'r' THEN 'SELECT'
    WHEN 'a' THEN 'INSERT'
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
  END AS command_type,
  polroles::regrole[] AS roles,
  pg_get_expr(polqual, polrelid) AS using_expr,
  pg_get_expr(polwithcheck, polrelid) AS with_check_expr
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;

-- 5. Check grants on the function
SELECT
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_name = 'handle_new_user'
  AND routine_schema = 'public';

-- 6. Check grants on profiles table
SELECT
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'profiles';

-- 7. Check if supabase_auth_admin role exists and its memberships
SELECT
  r.rolname,
  r.rolsuper,
  r.rolbypassrls,
  ARRAY(
    SELECT b.rolname
    FROM pg_catalog.pg_auth_members m
    JOIN pg_catalog.pg_roles b ON m.roleid = b.oid
    WHERE m.member = r.oid
  ) AS member_of
FROM pg_roles r
WHERE r.rolname IN ('postgres', 'supabase_auth_admin', 'authenticated', 'anon', 'service_role');

-- 8. Test: simulate what the trigger does (DRY RUN - does NOT insert)
-- This checks if the INSERT statement would work
EXPLAIN
INSERT INTO public.profiles (id, display_name, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'test_user',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- 9. Check for any existing errors in pg_stat_activity
SELECT
  pid,
  usename,
  state,
  query,
  backend_start,
  query_start
FROM pg_stat_activity
WHERE query ILIKE '%handle_new_user%' OR query ILIKE '%profiles%'
ORDER BY query_start DESC
LIMIT 10;

-- 10. Check recent auth.users entries (to see if any signups succeeded)
SELECT
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
