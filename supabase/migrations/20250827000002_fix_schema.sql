-- Fix schema issues for backend functions

-- Add missing columns to applicants table
ALTER TABLE applicants 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'incomplete';

ALTER TABLE applicants
ADD COLUMN IF NOT EXISTS documents_verified BOOLEAN DEFAULT FALSE;

-- Fix the index creation (remove the one that references non-existent column)
DROP INDEX IF EXISTS idx_applicants_application_status;
CREATE INDEX IF NOT EXISTS idx_applicants_application_id ON applicants(application_id);

-- Create the correct indexes
CREATE INDEX IF NOT EXISTS idx_documents_applicant_id ON documents(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_email ON applications(user_email);
CREATE INDEX IF NOT EXISTS idx_applications_reference ON applications(reference_number);

-- Make sure notification_queue exists
CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    notification_type TEXT,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fix permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE ON applications TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON applicants TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON documents TO anon, authenticated;
-- Grant permissions on saved_applications table (if exists)
-- GRANT SELECT, INSERT, UPDATE ON saved_applications TO anon, authenticated;