-- Storage Buckets and Policies for UK ETA Gateway

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('documents', 'documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf']::text[]),
    ('photos', 'photos', false, 5242880, ARRAY['image/jpeg', 'image/png']::text[]),
    ('passports', 'passports', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf']::text[])
ON CONFLICT (id) DO UPDATE
SET 
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for documents bucket
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] IN (
        SELECT ap.id::text
        FROM applicants ap
        JOIN applications a ON a.id = ap.application_id
        WHERE a.user_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.uid()::text = a.user_id::text
    )
);

CREATE POLICY "Users can view their documents"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
        SELECT ap.id::text
        FROM applicants ap
        JOIN applications a ON a.id = ap.application_id
        WHERE a.user_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.uid()::text = a.user_id::text
    )
);

CREATE POLICY "Users can delete their documents"
ON storage.objects FOR DELETE
TO authenticated, anon
USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
        SELECT ap.id::text
        FROM applicants ap
        JOIN applications a ON a.id = ap.application_id
        WHERE a.user_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.uid()::text = a.user_id::text
    )
);

-- Storage policies for photos bucket
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (
    bucket_id = 'photos' AND 
    (storage.foldername(name))[1] IN (
        SELECT ap.id::text
        FROM applicants ap
        JOIN applications a ON a.id = ap.application_id
        WHERE a.user_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.uid()::text = a.user_id::text
    )
);

CREATE POLICY "Users can view their photos"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (
    bucket_id = 'photos' AND
    (storage.foldername(name))[1] IN (
        SELECT ap.id::text
        FROM applicants ap
        JOIN applications a ON a.id = ap.application_id
        WHERE a.user_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.uid()::text = a.user_id::text
    )
);

-- Storage policies for passports bucket
CREATE POLICY "Users can upload passports"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (
    bucket_id = 'passports' AND 
    (storage.foldername(name))[1] IN (
        SELECT ap.id::text
        FROM applicants ap
        JOIN applications a ON a.id = ap.application_id
        WHERE a.user_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.uid()::text = a.user_id::text
    )
);

CREATE POLICY "Users can view their passports"
ON storage.objects FOR SELECT
TO authenticated, anon
USING (
    bucket_id = 'passports' AND
    (storage.foldername(name))[1] IN (
        SELECT ap.id::text
        FROM applicants ap
        JOIN applications a ON a.id = ap.application_id
        WHERE a.user_email = current_setting('request.jwt.claims', true)::json->>'email'
        OR auth.uid()::text = a.user_id::text
    )
);

-- Admin policies (service role can access everything)
CREATE POLICY "Service role can manage all documents"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id IN ('documents', 'photos', 'passports'));

-- Function to validate uploaded files
CREATE OR REPLACE FUNCTION validate_file_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    file_ext TEXT;
    allowed_exts TEXT[] := ARRAY['jpg', 'jpeg', 'png', 'pdf'];
BEGIN
    -- Extract file extension
    file_ext := LOWER(SPLIT_PART(NEW.name, '.', -1));
    
    -- Check if extension is allowed
    IF NOT (file_ext = ANY(allowed_exts)) THEN
        RAISE EXCEPTION 'File type % is not allowed', file_ext;
    END IF;
    
    -- Check file size (5MB max)
    IF NEW.metadata->>'size' IS NOT NULL AND 
       (NEW.metadata->>'size')::INT > 5242880 THEN
        RAISE EXCEPTION 'File size exceeds 5MB limit';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for file validation
CREATE TRIGGER validate_file_before_insert
    BEFORE INSERT ON storage.objects
    FOR EACH ROW
    WHEN (NEW.bucket_id IN ('documents', 'photos', 'passports'))
    EXECUTE FUNCTION validate_file_upload();

-- Function to generate secure file paths
CREATE OR REPLACE FUNCTION generate_secure_file_path(
    applicant_id UUID,
    document_type TEXT,
    original_filename TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    file_ext TEXT;
    secure_name TEXT;
BEGIN
    -- Extract file extension
    file_ext := LOWER(SPLIT_PART(original_filename, '.', -1));
    
    -- Generate secure filename with timestamp
    secure_name := applicant_id::TEXT || '/' || 
                   document_type || '_' || 
                   TO_CHAR(NOW(), 'YYYYMMDD_HH24MISS') || '_' ||
                   SUBSTRING(MD5(RANDOM()::TEXT), 1, 8) || '.' || file_ext;
    
    RETURN secure_name;
END;
$$;

-- Function to clean up orphaned files
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INT := 0;
BEGIN
    -- Delete files not referenced in documents table
    DELETE FROM storage.objects
    WHERE bucket_id IN ('documents', 'photos', 'passports')
    AND created_at < NOW() - INTERVAL '24 hours'
    AND name NOT IN (
        SELECT storage_path
        FROM documents
        WHERE storage_path IS NOT NULL
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION generate_secure_file_path(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_orphaned_files() TO service_role;