-- 1. Ensure the bucket 'jeuob' exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('jeuob', 'jeuob', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Access to view files (Important for site images)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'jeuob');

-- 3. Allow Authenticated users to upload files
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
CREATE POLICY "Auth Insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'jeuob');

-- 4. Allow Authenticated users to update their files
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
CREATE POLICY "Auth Update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'jeuob');

-- 5. Allow Authenticated users to delete their files
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;
CREATE POLICY "Auth Delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'jeuob');
