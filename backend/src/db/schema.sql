-- UK ETA Database Schema
-- PostgreSQL with security features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(12) UNIQUE NOT NULL,
    
    -- Encrypted personal data
    email_encrypted TEXT NOT NULL,
    phone_encrypted TEXT,
    application_data TEXT NOT NULL, -- Encrypted JSON
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    status_message TEXT,
    
    -- Payment information
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_intent_id VARCHAR(255),
    amount_paid DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'GBP',
    
    -- Admin fields
    admin_notes TEXT,
    reviewed_by VARCHAR(255),
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracking_code ON applications(tracking_code);
CREATE INDEX IF NOT EXISTS idx_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_submitted_at ON applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_payment_status ON applications(payment_status);

-- Documents table for secure file storage
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    -- Encrypted file information
    file_name_encrypted TEXT NOT NULL,
    file_path_encrypted TEXT NOT NULL,
    encryption_key_encrypted TEXT NOT NULL,
    
    -- Metadata
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    checksum VARCHAR(64) NOT NULL, -- SHA-256 hash for integrity
    
    -- Timestamps
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    accessed_at TIMESTAMP WITH TIME ZONE
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_application_id ON documents(application_id);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Security fields
    two_factor_secret TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    
    -- Access control
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Tracking
    last_login TIMESTAMP WITH TIME ZONE,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Status history for audit trail
CREATE TABLE IF NOT EXISTS status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    -- Status change details
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    change_reason TEXT,
    
    -- Timestamp
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick history lookup
CREATE INDEX IF NOT EXISTS idx_history_application_id ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_history_changed_at ON status_history(changed_at);

-- Email notifications log
CREATE TABLE IF NOT EXISTS email_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    
    -- Email details
    recipient_email_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for privacy
    email_type VARCHAR(50) NOT NULL,
    subject TEXT NOT NULL,
    
    -- Status
    sent_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    -- Tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for tracking
CREATE INDEX IF NOT EXISTS idx_email_application_id ON email_notifications(application_id);
CREATE INDEX IF NOT EXISTS idx_email_type ON email_notifications(email_type);

-- Security audit log
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- User information
    performed_by VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    
    -- Additional data
    details JSONB,
    
    -- Timestamp
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_performed_at ON audit_log(performed_at);

-- Session tokens for admin
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    
    -- Token information
    token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of token
    refresh_token_hash VARCHAR(64) UNIQUE,
    
    -- Session data
    ip_address INET,
    user_agent TEXT,
    
    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_token ON admin_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_session_admin ON admin_sessions(admin_id);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function for generating tracking codes
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS VARCHAR(12) AS $$
DECLARE
    code VARCHAR(12);
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate format: ETA-XXXX-XXXX
        code := 'ETA-' || 
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || 
                '-' || 
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        
        -- Check if code already exists
        SELECT COUNT(*) INTO exists_check 
        FROM applications 
        WHERE tracking_code = code;
        
        -- If unique, return it
        IF exists_check = 0 THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create view for admin dashboard statistics
CREATE OR REPLACE VIEW application_statistics AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'submitted') AS pending_count,
    COUNT(*) FILTER (WHERE status = 'in_review') AS in_review_count,
    COUNT(*) FILTER (WHERE status = 'approved') AS approved_count,
    COUNT(*) FILTER (WHERE status = 'denied') AS denied_count,
    COUNT(*) FILTER (WHERE status = 'need_info') AS need_info_count,
    COUNT(*) FILTER (WHERE payment_status = 'completed') AS paid_count,
    COUNT(*) FILTER (WHERE submitted_at >= CURRENT_DATE) AS today_count,
    COUNT(*) FILTER (WHERE submitted_at >= CURRENT_DATE - INTERVAL '7 days') AS week_count,
    COUNT(*) AS total_count,
    SUM(amount_paid) FILTER (WHERE payment_status = 'completed') AS total_revenue
FROM applications;

-- Indexes for performance
CREATE INDEX idx_applications_composite ON applications(status, submitted_at DESC);
CREATE INDEX idx_documents_composite ON documents(application_id, uploaded_at DESC);

-- Comments for documentation
COMMENT ON TABLE applications IS 'Main applications table with encrypted personal data';
COMMENT ON TABLE documents IS 'Secure document storage with encryption';
COMMENT ON TABLE admin_users IS 'Admin users with 2FA support';
COMMENT ON TABLE status_history IS 'Complete audit trail of status changes';
COMMENT ON TABLE audit_log IS 'Security audit log for all sensitive operations';