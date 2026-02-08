-- Allow anonymous (unauthenticated) users to SELECT (read) files from 'exercise-videos' bucket
-- We use DROP POLICY IF EXISTS to avoid errors if you run this twice
DROP POLICY IF EXISTS "Allow anon read access" ON storage.objects;
CREATE POLICY "Allow anon read access"
ON storage.objects FOR SELECT
TO anon
USING ( bucket_id = 'exercise-videos' );

-- Also allow authenticated users
DROP POLICY IF EXISTS "Allow authenticated read access" ON storage.objects;
CREATE POLICY "Allow authenticated read access"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'exercise-videos' );
