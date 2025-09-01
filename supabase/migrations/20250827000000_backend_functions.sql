-- Backend Functions and Triggers for UK ETA Gateway

-- Function to generate unique reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_ref TEXT;
    exists_count INT;
BEGIN
    LOOP
        -- Generate reference: UK + Year + Random 6 characters
        new_ref := 'UK' || TO_CHAR(NOW(), 'YY') || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
        
        -- Check if it exists
        SELECT COUNT(*) INTO exists_count 
        FROM applications 
        WHERE reference_number = new_ref;
        
        -- If unique, return it
        IF exists_count = 0 THEN
            RETURN new_ref;
        END IF;
    END LOOP;
END;
$$;

-- Function to set reference number on insert
CREATE OR REPLACE FUNCTION set_reference_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
        NEW.reference_number := generate_reference_number();
    END IF;
    RETURN NEW;
END;
$$;

-- Trigger to auto-generate reference numbers
DROP TRIGGER IF EXISTS set_application_reference ON applications;
CREATE TRIGGER set_application_reference
    BEFORE INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION set_reference_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Add updated_at triggers to all tables
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_applicants_updated_at ON applicants;
CREATE TRIGGER update_applicants_updated_at
    BEFORE UPDATE ON applicants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to calculate application fees
CREATE OR REPLACE FUNCTION calculate_application_fee(applicant_count INT)
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
    fee_per_applicant DECIMAL := 10.00;
    processing_fee DECIMAL := 2.50;
BEGIN
    RETURN (applicant_count * fee_per_applicant) + processing_fee;
END;
$$;

-- Function to check if application is complete
CREATE OR REPLACE FUNCTION is_application_complete(app_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    incomplete_count INT;
    missing_docs_count INT;
BEGIN
    -- Check for incomplete applicants
    SELECT COUNT(*) INTO incomplete_count
    FROM applicants
    WHERE application_id = app_id
    AND status != 'complete';
    
    IF incomplete_count > 0 THEN
        RETURN FALSE;
    END IF;
    
    -- Check for missing required documents
    SELECT COUNT(*) INTO missing_docs_count
    FROM applicants a
    WHERE a.application_id = app_id
    AND NOT EXISTS (
        SELECT 1 FROM documents d
        WHERE d.applicant_id = a.id
        AND d.document_type = 'passport'
        AND d.verification_status = 'verified'
    )
    OR NOT EXISTS (
        SELECT 1 FROM documents d
        WHERE d.applicant_id = a.id
        AND d.document_type = 'photo'
        AND d.verification_status = 'verified'
    );
    
    RETURN missing_docs_count = 0;
END;
$$;

-- Function to send notification (placeholder for email integration)
CREATE OR REPLACE FUNCTION send_notification(
    email TEXT,
    subject TEXT,
    body TEXT,
    notification_type TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    -- Log notification request
    INSERT INTO notification_queue (
        email,
        subject,
        body,
        notification_type,
        status,
        created_at
    ) VALUES (
        email,
        subject,
        body,
        notification_type,
        'pending',
        NOW()
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Notification queued'
    );
END;
$$;

-- Create notification queue table
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

-- Function to process expired saved applications
CREATE OR REPLACE FUNCTION cleanup_expired_applications()
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM saved_applications
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$;

-- Function to get application statistics
CREATE OR REPLACE FUNCTION get_application_stats(date_from DATE DEFAULT NULL, date_to DATE DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    total_apps INT;
    submitted_apps INT;
    approved_apps INT;
    pending_apps INT;
    total_revenue DECIMAL;
BEGIN
    -- Default date range if not provided
    date_from := COALESCE(date_from, NOW() - INTERVAL '30 days');
    date_to := COALESCE(date_to, NOW());
    
    -- Count applications by status
    SELECT COUNT(*) INTO total_apps
    FROM applications
    WHERE created_at BETWEEN date_from AND date_to;
    
    SELECT COUNT(*) INTO submitted_apps
    FROM applications
    WHERE status = 'submitted'
    AND created_at BETWEEN date_from AND date_to;
    
    SELECT COUNT(*) INTO approved_apps
    FROM applications
    WHERE status = 'approved'
    AND created_at BETWEEN date_from AND date_to;
    
    SELECT COUNT(*) INTO pending_apps
    FROM applications
    WHERE status IN ('draft', 'processing')
    AND created_at BETWEEN date_from AND date_to;
    
    -- Calculate revenue
    SELECT COALESCE(SUM(payment_amount / 100.0), 0) INTO total_revenue
    FROM applications
    WHERE payment_status = 'paid'
    AND created_at BETWEEN date_from AND date_to;
    
    RETURN jsonb_build_object(
        'total_applications', total_apps,
        'submitted', submitted_apps,
        'approved', approved_apps,
        'pending', pending_apps,
        'total_revenue', total_revenue,
        'date_from', date_from,
        'date_to', date_to
    );
END;
$$;

-- Function to validate applicant data
CREATE OR REPLACE FUNCTION validate_applicant_data(applicant_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    errors JSONB := '[]'::jsonb;
BEGIN
    -- Check required fields
    IF applicant_data->>'first_name' IS NULL OR LENGTH(applicant_data->>'first_name') < 2 THEN
        errors := errors || jsonb_build_object('field', 'first_name', 'error', 'First name is required (min 2 characters)');
    END IF;
    
    IF applicant_data->>'last_name' IS NULL OR LENGTH(applicant_data->>'last_name') < 2 THEN
        errors := errors || jsonb_build_object('field', 'last_name', 'error', 'Last name is required (min 2 characters)');
    END IF;
    
    IF applicant_data->>'passport_number' IS NULL OR NOT (applicant_data->>'passport_number' ~ '^[A-Z0-9]{6,20}$') THEN
        errors := errors || jsonb_build_object('field', 'passport_number', 'error', 'Invalid passport number format');
    END IF;
    
    IF applicant_data->>'email' IS NULL OR NOT (applicant_data->>'email' ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
        errors := errors || jsonb_build_object('field', 'email', 'error', 'Invalid email address');
    END IF;
    
    -- Check date validations
    IF applicant_data->>'passport_expiry_date' IS NOT NULL AND 
       (applicant_data->>'passport_expiry_date')::DATE < NOW() THEN
        errors := errors || jsonb_build_object('field', 'passport_expiry_date', 'error', 'Passport has expired');
    END IF;
    
    IF applicant_data->>'date_of_birth' IS NOT NULL AND 
       (applicant_data->>'date_of_birth')::DATE > NOW() THEN
        errors := errors || jsonb_build_object('field', 'date_of_birth', 'error', 'Date of birth cannot be in the future');
    END IF;
    
    RETURN jsonb_build_object(
        'valid', jsonb_array_length(errors) = 0,
        'errors', errors
    );
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_status_created ON applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_payment_status ON applications(payment_status, payment_amount);
CREATE INDEX IF NOT EXISTS idx_applicants_application_id ON applicants(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_applicant_type ON documents(applicant_id, document_type);
CREATE INDEX IF NOT EXISTS idx_documents_verification ON documents(verification_status);
-- Indexes for audit_logs and notification_queue would go here if tables existed

-- Create view for application overview
CREATE OR REPLACE VIEW application_overview AS
SELECT 
    a.id,
    a.reference_number,
    a.status,
    a.payment_status,
    a.payment_amount,
    a.created_at,
    a.submitted_at,
    a.user_email,
    COUNT(DISTINCT ap.id) as applicant_count,
    COUNT(DISTINCT d.id) as document_count,
    COUNT(DISTINCT CASE WHEN d.verification_status = 'verified' THEN d.id END) as verified_documents
FROM applications a
LEFT JOIN applicants ap ON ap.application_id = a.id
LEFT JOIN documents d ON d.applicant_id = ap.id
GROUP BY a.id, a.reference_number, a.status, a.payment_status, 
         a.payment_amount, a.created_at, a.submitted_at, a.user_email;

-- Grant permissions for functions
GRANT EXECUTE ON FUNCTION generate_reference_number() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_application_fee(INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_application_complete(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_applicant_data(JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_application_stats(DATE, DATE) TO authenticated;

-- Notification queue grants would go here if table existed

-- Grant access to application overview
GRANT SELECT ON application_overview TO anon, authenticated;