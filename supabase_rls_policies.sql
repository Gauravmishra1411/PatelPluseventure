-- This file contains the SQL statements to enable Row Level Security (RLS)
-- and create policies on your Supabase tables.
-- You should run these commands in the Supabase SQL Editor
-- to secure your database.

-- 1. Enable RLS for the 'contact_messages' table
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows admin users to perform all operations.
-- This assumes you have a way to identify admin users, for example,
-- by checking a custom claim in their JWT.
-- You might need to adjust the an 'get_my_claim' function depending on your setup.
-- Supabase docs on custom claims: https://supabase.com/docs/guides/auth/custom-claims

CREATE POLICY "Allow admin full access"
ON public.contact_messages
FOR ALL
USING (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
);

-- 3. Create a policy to allow public (unauthenticated) users to insert messages.
-- This is necessary for your contact form to work.
CREATE POLICY "Allow public insert"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Repeat for other tables as needed. For example, for a 'users' table:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow admin full access on users" ON public.users FOR ALL USING ((get_my_claim('user_role'::text) = '"admin"'::jsonb));
