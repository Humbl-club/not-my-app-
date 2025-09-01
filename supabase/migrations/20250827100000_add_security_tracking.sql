-- Add security tracking tables and fields
-- This migration adds proper security for application tracking

-- Add security fields to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS security_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS secure_reference VARCHAR(20);

-- Create tracking tokens table for secure session management
CREATE TABLE IF NOT EXISTS tracking_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT NOT NULL UNIQUE,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create index for token lookup
CREATE INDEX IF NOT EXISTS idx_tracking_tokens_token ON tracking_tokens(token);
CREATE INDEX IF NOT EXISTS idx_tracking_tokens_expires ON tracking_tokens(expires_at);

-- Create application access logs for audit trail
CREATE TABLE IF NOT EXISTS application_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    action VARCHAR(50) NOT NULL,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for audit queries
CREATE INDEX IF NOT EXISTS idx_access_logs_application ON application_access_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_accessed ON application_access_logs(accessed_at);

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limit_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL, -- IP address or user identifier
    action VARCHAR(50) NOT NULL,
    attempts INTEGER DEFAULT 1,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for rate limit checks
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON rate_limit_tracking(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limit_locked ON rate_limit_tracking(locked_until);

-- Function to generate secure reference with checksum
CREATE OR REPLACE FUNCTION generate_secure_reference()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    random1 TEXT;
    random2 TEXT;
    base_ref TEXT;
    checksum INTEGER;
    final_ref TEXT;
BEGIN
    -- Get current year
    year_part := TO_CHAR(NOW(), 'YYYY');
    
    -- Generate random alphanumeric parts
    random1 := UPPER(substring(md5(random()::text) from 1 for 4));
    random2 := UPPER(substring(md5(random()::text) from 1 for 4));
    
    -- Build base reference
    base_ref := 'UK-' || year_part || '-' || random1 || '-' || random2;
    
    -- Calculate simple checksum
    checksum := 0;
    FOR i IN 1..length(base_ref) LOOP
        checksum := checksum + ascii(substring(base_ref from i for 1)) * i;
    END LOOP;
    checksum := checksum % 97;
    
    -- Build final reference with checksum
    final_ref := base_ref || '-' || LPAD(checksum::text, 2, '0');
    
    RETURN final_ref;
END;
$$ LANGUAGE plpgsql;

-- Function to generate 6-digit security code
CREATE OR REPLACE FUNCTION generate_security_code()
RETURNS TEXT AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Update existing applications with security codes (for testing)
UPDATE applications 
SET 
    security_code = generate_security_code(),
    secure_reference = generate_secure_reference()
WHERE security_code IS NULL;

-- Trigger to auto-generate security fields for new applications
CREATE OR REPLACE FUNCTION set_application_security_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.security_code IS NULL THEN
        NEW.security_code := generate_security_code();
    END IF;
    
    IF NEW.secure_reference IS NULL THEN
        NEW.secure_reference := generate_secure_reference();
    END IF;
    
    -- Also update the reference_number to use secure format
    IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
        NEW.reference_number := NEW.secure_reference;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new applications
DROP TRIGGER IF EXISTS set_application_security_trigger ON applications;
CREATE TRIGGER set_application_security_trigger
    BEFORE INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION set_application_security_fields();

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM tracking_tokens
    WHERE expires_at < NOW();
    
    -- Also clean old rate limit records
    DELETE FROM rate_limit_tracking
    WHERE created_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up tokens (if pg_cron is available)
-- This would need to be set up separately in production
-- SELECT cron.schedule('cleanup-expired-tokens', '*/15 * * * *', 'SELECT cleanup_expired_tokens();');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON tracking_tokens TO authenticated;
GRANT SELECT, INSERT ON application_access_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON rate_limit_tracking TO authenticated;

-- Row Level Security for tracking tokens
ALTER TABLE tracking_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own tokens"
    ON tracking_tokens
    FOR ALL
    USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE user_email = auth.email()
        )
    );

-- Row Level Security for access logs (read-only for users)
ALTER TABLE application_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own access logs"
    ON application_access_logs
    FOR SELECT
    USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE user_email = auth.email()
        )
    );

-- Comments for documentation
COMMENT ON TABLE tracking_tokens IS 'Secure tokens for application tracking sessions';
COMMENT ON TABLE application_access_logs IS 'Audit trail for application access';
COMMENT ON TABLE rate_limit_tracking IS 'Rate limiting to prevent brute force attacks';
COMMENT ON COLUMN applications.security_code IS '6-digit security code for verification';
COMMENT ON COLUMN applications.secure_reference IS 'Secure reference with checksum validation';