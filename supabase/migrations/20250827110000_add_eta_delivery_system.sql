-- ETA Delivery System Tables
-- Handles automatic delivery of approved ETAs to client dashboards

-- Create ETA documents table
CREATE TABLE IF NOT EXISTS eta_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    reference_number VARCHAR(50) NOT NULL,
    eta_number VARCHAR(20) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, generated, delivered, downloaded
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    document_url TEXT,
    generated_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    downloaded_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client documents table (links ETAs to client dashboards)
CREATE TABLE IF NOT EXISTS client_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_email VARCHAR(255) NOT NULL,
    document_type VARCHAR(20) NOT NULL, -- 'eta', 'receipt', etc.
    document_id UUID REFERENCES eta_documents(id) ON DELETE CASCADE,
    reference_number VARCHAR(50),
    eta_number VARCHAR(20),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accessed_at TIMESTAMP WITH TIME ZONE
);

-- Create document downloads log
CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add ETA fields to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS eta_issued BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS eta_issued_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS eta_documents JSONB;

-- Add ETA status to applicants
ALTER TABLE applicants
ADD COLUMN IF NOT EXISTS eta_status VARCHAR(20),
ADD COLUMN IF NOT EXISTS eta_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS eta_issued_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_eta_documents_application ON eta_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_eta_documents_eta_number ON eta_documents(eta_number);
CREATE INDEX IF NOT EXISTS idx_eta_documents_status ON eta_documents(status);
CREATE INDEX IF NOT EXISTS idx_client_documents_email ON client_documents(client_email);
CREATE INDEX IF NOT EXISTS idx_client_documents_doc_id ON client_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_document_downloads_doc ON document_downloads(document_id);

-- Create storage bucket for ETA documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'eta-documents',
    'eta-documents',
    false,
    10485760, -- 10MB
    ARRAY['application/pdf', 'application/json']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Function to generate ETA number
CREATE OR REPLACE FUNCTION generate_eta_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    random_part TEXT;
    eta_num TEXT;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');
    random_part := UPPER(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    eta_num := 'ETA' || year_part || random_part;
    RETURN eta_num;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically deliver ETA to client dashboard
CREATE OR REPLACE FUNCTION deliver_eta_to_client()
RETURNS TRIGGER AS $$
BEGIN
    -- When an ETA is generated, automatically add to client's dashboard
    IF NEW.status = 'generated' AND OLD.status != 'generated' THEN
        -- Get the application's user email
        INSERT INTO client_documents (
            client_email,
            document_type,
            document_id,
            reference_number,
            eta_number,
            status
        )
        SELECT 
            a.user_email,
            'eta',
            NEW.id,
            NEW.reference_number,
            NEW.eta_number,
            'available'
        FROM applications a
        WHERE a.id = NEW.application_id;
        
        -- Mark as delivered
        NEW.status := 'delivered';
        NEW.delivered_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic delivery
DROP TRIGGER IF EXISTS auto_deliver_eta_trigger ON eta_documents;
CREATE TRIGGER auto_deliver_eta_trigger
    BEFORE UPDATE ON eta_documents
    FOR EACH ROW
    EXECUTE FUNCTION deliver_eta_to_client();

-- Function to get client dashboard
CREATE OR REPLACE FUNCTION get_client_dashboard(p_client_email TEXT)
RETURNS TABLE (
    application_id UUID,
    reference_number VARCHAR,
    application_status VARCHAR,
    submitted_date TIMESTAMP WITH TIME ZONE,
    eta_count BIGINT,
    eta_documents JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id as application_id,
        a.reference_number,
        a.status as application_status,
        a.created_at as submitted_date,
        COUNT(DISTINCT ed.id) as eta_count,
        COALESCE(
            jsonb_agg(
                DISTINCT jsonb_build_object(
                    'eta_number', ed.eta_number,
                    'status', ed.status,
                    'valid_from', ed.valid_from,
                    'valid_until', ed.valid_until,
                    'document_id', ed.id,
                    'downloaded_at', ed.downloaded_at
                )
            ) FILTER (WHERE ed.id IS NOT NULL),
            '[]'::jsonb
        ) as eta_documents
    FROM applications a
    LEFT JOIN eta_documents ed ON ed.application_id = a.id
    WHERE a.user_email = p_client_email
    GROUP BY a.id, a.reference_number, a.status, a.created_at
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security for client documents
ALTER TABLE eta_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can only see their own ETA documents
CREATE POLICY "Clients view own ETAs"
    ON eta_documents
    FOR SELECT
    USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE user_email = auth.email()
        )
    );

-- Policy: Clients can only see their own dashboard documents
CREATE POLICY "Clients view own documents"
    ON client_documents
    FOR SELECT
    USING (client_email = auth.email());

-- Policy: Clients can download their own documents
CREATE POLICY "Clients download own documents"
    ON client_documents
    FOR UPDATE
    USING (client_email = auth.email());

-- Policy: Admin can manage all ETA documents
CREATE POLICY "Admin manage ETAs"
    ON eta_documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() 
            AND is_active = true
        )
    );

-- Grants
GRANT SELECT, INSERT, UPDATE ON eta_documents TO authenticated;
GRANT SELECT, UPDATE ON client_documents TO authenticated;
GRANT INSERT ON document_downloads TO authenticated;

-- Comments for documentation
COMMENT ON TABLE eta_documents IS 'Stores generated ETA documents for approved applications';
COMMENT ON TABLE client_documents IS 'Links documents to client dashboards for easy access';
COMMENT ON TABLE document_downloads IS 'Audit log of all document downloads';
COMMENT ON COLUMN eta_documents.eta_number IS 'Unique ETA number in format ETA2024XXXXXXXX';
COMMENT ON COLUMN eta_documents.status IS 'Document lifecycle: pending -> generated -> delivered -> downloaded';