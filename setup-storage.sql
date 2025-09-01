-- Create storage buckets for UK ETA Gateway

-- Create documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'application/pdf']::text[];

-- Create photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png']::text[];

-- Create passports bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'passports',
  'passports',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'application/pdf']::text[];

-- Set up storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id IN ('documents', 'photos', 'passports'));

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT 
  USING (bucket_id IN ('documents', 'photos', 'passports'));

CREATE POLICY "Service role can manage all documents" ON storage.objects
  FOR ALL 
  USING (auth.role() = 'service_role');