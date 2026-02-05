-- Function to handle new user role and info synchronization from Auth to Profiles
-- This ensures the metadata passed during signUp/signInWithOtp is respected.

-- Ensure the email column exists in profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    target_role text;
    target_full_name text;
BEGIN
    -- Extract role from metadata, default to 'viewer' if not present
    -- This fixes the bug where everything defaulted to 'admin' (or wasn't being read)
    target_role := COALESCE(new.raw_user_meta_data->>'role', 'viewer');
    
    -- Extract full name from metadata
    target_full_name := COALESCE(new.raw_user_meta_data->>'full_name', 'Nouveau Membre');

    INSERT INTO public.profiles (id, full_name, role, status, email)
    VALUES (
        new.id,
        target_full_name,
        target_role,
        'active',
        new.email
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        email = EXCLUDED.email;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger to auth.users if it doesn't exist or to ensure it's using the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure all current profiles have the email address synced for clarity
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;
