-- Create UK ETA Gateway Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'processing', 'approved', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE document_type AS ENUM ('passport', 'photo', 'supporting');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE admin_role AS ENUM ('admin', 'super_admin');

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    
    -- Reference and identification
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_id UUID, -- Optional: for authenticated users
    
    -- Application details
    status application_status DEFAULT 'draft',
    application_type VARCHAR(20) DEFAULT 'individual',
    
    -- Payment information
    payment_status payment_status DEFAULT 'pending',
    payment_intent_id VARCHAR(255),
    payment_amount INTEGER, -- Amount in pence/cents
    
    -- Application data (JSON)
    application_data JSONB NOT NULL DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Tracking
    ip_address INET,
    user_agent TEXT,
    
    CONSTRAINT applications_reference_number_format CHECK (reference_number ~ '^[A-Z0-9]{6,20}$')
);

-- Applicants table (for individual applicant details)
CREATE TABLE applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    applicant_number INTEGER NOT NULL DEFAULT 1,
    
    -- Personal Information
    title VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    nationality VARCHAR(3) NOT NULL, -- ISO country code
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Address Information
    address_line_1 VARCHAR(200),
    address_line_2 VARCHAR(200),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(3), -- ISO country code
    
    -- Passport Information
    passport_number VARCHAR(50),
    passport_issue_date DATE,
    passport_expiry_date DATE,
    passport_issuing_country VARCHAR(3),
    
    -- Travel Information
    arrival_date DATE,
    departure_date DATE,
    purpose_of_visit TEXT,
    accommodation_address TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(50),
    
    -- Additional data
    additional_data JSONB DEFAULT '{}',
    
    UNIQUE(application_id, applicant_number)
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
    
    -- Document details
    document_type document_type NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Verification
    verification_status verification_status DEFAULT 'pending',
    verification_notes TEXT,
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    upload_ip INET,
    metadata JSONB DEFAULT '{}'
);

-- Admin users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    email VARCHAR(255) UNIQUE NOT NULL,
    role admin_role DEFAULT 'admin',
    
    -- Activity tracking
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    
    -- Preferences
    preferences JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true
);

-- Application logs table (for audit trail)
CREATE TABLE application_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    
    -- Actor information
    actor_type VARCHAR(20) DEFAULT 'system', -- 'user', 'admin', 'system'
    actor_id UUID,
    actor_email VARCHAR(255),
    
    -- Request context
    ip_address INET,
    user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_applications_reference_number ON applications(reference_number);
CREATE INDEX idx_applications_user_email ON applications(user_email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_applications_payment_status ON applications(payment_status);

CREATE INDEX idx_applicants_application_id ON applicants(application_id);
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_applicants_passport_number ON applicants(passport_number);

CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_applicant_id ON documents(applicant_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_verification_status ON documents(verification_status);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

CREATE INDEX idx_application_logs_application_id ON application_logs(application_id);
CREATE INDEX idx_application_logs_created_at ON application_logs(created_at);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applicants_updated_at BEFORE UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
    ref_number TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        ref_number := 'UKE' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD((EXTRACT(EPOCH FROM NOW())::INTEGER % 10000)::TEXT, 4, '0');
        
        -- Check if reference number already exists
        IF NOT EXISTS (SELECT 1 FROM applications WHERE reference_number = ref_number) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            -- Fallback to UUID-based reference if we can't generate unique number
            ref_number := 'UKE' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8));
            EXIT;
        END IF;
    END LOOP;
    
    RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Applications: Users can access their own applications
CREATE POLICY "Users can view their own applications" ON applications
    FOR SELECT USING (user_email = auth.email() OR user_id = auth.uid());

CREATE POLICY "Users can create applications" ON applications
    FOR INSERT WITH CHECK (user_email = auth.email() OR user_id = auth.uid());

CREATE POLICY "Users can update their own draft applications" ON applications
    FOR UPDATE USING (
        (user_email = auth.email() OR user_id = auth.uid()) 
        AND status = 'draft'
    );

-- Admin policies for applications
CREATE POLICY "Admins can view all applications" ON applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() AND is_active = true
        )
    );

-- Similar policies for other tables...
CREATE POLICY "Users can access their applicants" ON applicants
    FOR ALL USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE user_email = auth.email() OR user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access their documents" ON documents
    FOR ALL USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE user_email = auth.email() OR user_id = auth.uid()
        )
    );

-- Admin users can only be managed by super admins
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() AND role = 'super_admin' AND is_active = true
        )
    );

-- Application logs are readable by application owners and admins
CREATE POLICY "Application logs access" ON application_logs
    FOR SELECT USING (
        application_id IN (
            SELECT id FROM applications 
            WHERE user_email = auth.email() OR user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.email() AND is_active = true
        )
    );

-- Insert some initial data
INSERT INTO admin_users (email, role) VALUES 
    ('admin@uketa.gov.uk', 'super_admin'),
    ('support@uketa.gov.uk', 'admin');