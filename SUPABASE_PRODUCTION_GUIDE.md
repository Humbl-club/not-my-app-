# 🗄️ SUPABASE PRODUCTION SETUP GUIDE
## Complete Day 2 Implementation

**Current Status:** Development Supabase Working Locally  
**Target:** Production Supabase with All Features Deployed  
**Duration:** Day 2 of Phase 1 (2-4 hours)  

---

## 📋 OVERVIEW

You currently have a fully functional **local Supabase setup** with:
- ✅ 8 database migrations
- ✅ 5 Edge Functions 
- ✅ Complete security tracking system
- ✅ ETA delivery automation
- ✅ Storage buckets and policies

Now we'll deploy this **identical setup** to production with enhanced security and monitoring.

---

## 🚀 STEP-BY-STEP SETUP

### **Option 1: Automated Interactive Setup (Recommended)**

Run the interactive setup script that guides you through each step:

```bash
./scripts/setup-production-interactive.sh
```

This script will:
1. ✅ Check prerequisites and install required tools
2. ✅ Help you create the production project
3. ✅ Configure environment variables
4. ✅ Deploy all migrations and functions
5. ✅ Set up storage and monitoring
6. ✅ Test the complete setup

### **Option 2: Manual Setup**

If you prefer manual control, follow these steps:

#### **Step 1: Create Production Project**

1. Go to https://supabase.com/dashboard
2. Click "New project"
3. Configure:
   - **Name:** UK ETA Gateway (Production)
   - **Database Password:** [Generate strong password]
   - **Region:** Europe West (London) - `eu-west-1`
   - **Plan:** Pro ($25/month)
4. Wait for project creation (2-3 minutes)

#### **Step 2: Get Project Credentials**

1. Go to **Settings > API** in your new project
2. Copy these values:
   - Project URL: `https://xxx.supabase.co`
   - Project ID: `xxx` (from the URL)
   - anon public key
   - service_role key

#### **Step 3: Update Environment**

Create `.env.production.local`:
```bash
# Production Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_PROJECT_ID=your_project_id

# Application Configuration
VITE_APP_URL=https://uketa.gov.uk
VITE_ENVIRONMENT=production
```

#### **Step 4: Link and Deploy**

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase@latest

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref your_project_id

# Deploy database migrations
supabase db push --include-all

# Deploy Edge Functions
supabase functions deploy admin-dashboard
supabase functions deploy create-payment-intent
supabase functions deploy send-email
supabase functions deploy submit-application
supabase functions deploy verify-document
```

#### **Step 5: Configure Storage**

Run this SQL in your production database:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('documents', 'documents', false, 5242880, '{"image/jpeg","image/png","application/pdf"}'),
  ('photos', 'photos', false, 5242880, '{"image/jpeg","image/png"}'),
  ('passports', 'passports', false, 5242880, '{"image/jpeg","image/png"}'),
  ('etas', 'etas', false, 10485760, '{"application/pdf"}')
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for storage
CREATE POLICY IF NOT EXISTS "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('documents', 'photos', 'passports'));

CREATE POLICY IF NOT EXISTS "Users can view their documents" ON storage.objects
FOR SELECT USING (bucket_id IN ('documents', 'photos', 'passports'));

CREATE POLICY IF NOT EXISTS "Admins can access all buckets" ON storage.objects
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🔧 PRODUCTION CONFIGURATION

### **Database Migrations Deployed**

Your production database will have these tables and features:

```sql
-- Core Application Tables
applications              -- Main applications table
applicants               -- Individual applicant data
documents                -- Document storage references
eta_documents            -- Generated ETA documents

-- Security & Tracking
tracking_tokens          -- Secure reference system
application_access_logs  -- Audit trail
rate_limit_tracking      -- Rate limiting data

-- Admin Features  
client_documents         -- ETA delivery system
document_downloads       -- Download tracking
```

### **Edge Functions Deployed**

Your production API will have these endpoints:

```bash
# Admin Functions
https://xxx.supabase.co/functions/v1/admin-dashboard

# Application Processing
https://xxx.supabase.co/functions/v1/submit-application
https://xxx.supabase.co/functions/v1/verify-document

# Payment Integration
https://xxx.supabase.co/functions/v1/create-payment-intent

# Communication
https://xxx.supabase.co/functions/v1/send-email
```

### **Security Features**

- **Row Level Security (RLS):** Enabled on all tables
- **API Authentication:** JWT token validation
- **Rate Limiting:** Built into tracking system
- **File Upload Security:** Type validation and size limits
- **Audit Logging:** Complete access trail

---

## 🧪 TESTING PRODUCTION SETUP

After setup, test your production environment:

```bash
# Run comprehensive API tests
./scripts/test-production-api.sh
```

This will test:
- ✅ Database connectivity and tables
- ✅ All Edge Functions
- ✅ Storage buckets
- ✅ Authentication endpoints
- ✅ Security policies
- ✅ Performance metrics

### **Expected Test Results**

You should see output like:
```
🧪 UK ETA Gateway - Production API Testing
===========================================
Testing Production Environment:
URL: https://xxx.supabase.co
Project ID: xxx

📊 Database Tests
==================
Testing Database Connection... ✅ PASS (HTTP 200)
Testing Applications Table... ✅ PASS (HTTP 200)
Testing Applicants Table... ✅ PASS (HTTP 200)

⚡ Edge Function Tests
======================
Testing Edge Function: admin-dashboard... ✅ PASS (HTTP 401)
Testing Edge Function: create-payment-intent... ✅ PASS (HTTP 400)
```

---

## 🔐 PRODUCTION SECURITY

### **Environment Variables for Edge Functions**

Set these in **Supabase Dashboard > Edge Functions > Settings**:

```bash
# Stripe Integration
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration
SMTP_HOST=smtp.uketa.gov.uk
SMTP_USER=noreply@uketa.gov.uk
SMTP_PASS=your_smtp_password

# reCAPTCHA Verification
RECAPTCHA_SECRET_KEY=your_recaptcha_secret

# Application Security
JWT_SECRET=your_jwt_secret_256_bit
ENCRYPTION_KEY=your_encryption_key_256_bit
```

### **Dashboard Security Settings**

1. **Settings > Database:**
   - ✅ Enable Point-in-Time Recovery
   - ✅ Set retention period to 7+ days
   - ✅ Enable connection pooling

2. **Settings > API:**
   - ✅ Add custom domain (api.uketa.gov.uk)
   - ✅ Configure CORS origins
   - ✅ Enable JWT verification

3. **Settings > Auth:**
   - ✅ Disable public signup
   - ✅ Enable email confirmations
   - ✅ Set session timeout to 30 minutes

---

## 📊 MONITORING & ALERTS

### **Enable in Supabase Dashboard**

1. **Reports Section:**
   - ✅ API usage monitoring
   - ✅ Database performance metrics
   - ✅ Error rate tracking

2. **Alerts Configuration:**
   - ✅ Email alerts for errors
   - ✅ High API usage notifications
   - ✅ Database performance warnings

### **Custom Health Monitoring**

The setup creates a health check script:

```bash
# Monitor production health
./supabase-health-check.sh
```

Add this to your monitoring system or run via cron:
```bash
# Check every 5 minutes
*/5 * * * * /usr/local/bin/supabase-health-check
```

---

## 🌐 CUSTOM DOMAIN SETUP (OPTIONAL)

To use `api.uketa.gov.uk` instead of `xxx.supabase.co`:

1. **Supabase Dashboard:**
   - Go to Settings > API
   - Add custom domain: `api.uketa.gov.uk`
   - Get CNAME target

2. **DNS Configuration:**
   ```bash
   # Add CNAME record
   api.uketa.gov.uk CNAME your-supabase-cname-target
   ```

3. **Update Environment:**
   ```bash
   VITE_SUPABASE_URL=https://api.uketa.gov.uk
   ```

---

## 🚨 TROUBLESHOOTING

### **Common Issues**

#### **Migration Failures**
```bash
# Check migration status
supabase migration list

# Repair if needed
supabase db reset --linked
```

#### **Edge Function Deployment Issues**
```bash
# Check function logs
supabase functions logs function-name

# Redeploy individual function
supabase functions deploy function-name --verify-jwt false
```

#### **Storage Bucket Issues**
```bash
# Check bucket policies
SELECT * FROM storage.buckets;
SELECT * FROM storage.objects;
```

#### **Performance Issues**
```bash
# Check connection pooling
SELECT * FROM pg_stat_activity;

# Monitor query performance
SELECT query, calls, mean_time FROM pg_stat_statements;
```

---

## 📋 POST-SETUP CHECKLIST

### **Immediate Tasks**
- [ ] ✅ Production project created and linked
- [ ] ✅ All 8 migrations deployed successfully  
- [ ] ✅ All 5 Edge Functions responding
- [ ] ✅ Storage buckets created with RLS policies
- [ ] ✅ Environment variables configured
- [ ] ✅ API tests passing (>90% success rate)

### **Configuration Tasks**
- [ ] ✅ Point-in-Time Recovery enabled
- [ ] ✅ Monitoring and alerts configured  
- [ ] ✅ Custom domain configured (optional)
- [ ] ✅ CORS origins updated for production
- [ ] ✅ Rate limiting tested and working

### **Security Tasks**
- [ ] ✅ Public signup disabled
- [ ] ✅ JWT verification enabled
- [ ] ✅ RLS policies tested
- [ ] ✅ File upload restrictions verified
- [ ] ✅ Audit logging functional

---

## 🎯 SUCCESS CRITERIA

**Production Supabase setup is complete when:**

1. **✅ API Test Results:** >95% tests passing
2. **✅ Response Times:** <500ms for database queries
3. **✅ Security:** All RLS policies active
4. **✅ Functions:** All 5 Edge Functions deployed and responding
5. **✅ Storage:** All 4 buckets created with proper policies
6. **✅ Monitoring:** Health checks and alerts configured

---

## 🚀 NEXT STEPS

After completing Supabase production setup:

1. **✅ Update Frontend Configuration**
   - Deploy with new production environment variables
   - Test application flow end-to-end

2. **✅ Move to Day 3: Payment Integration**
   - Set up live Stripe account
   - Configure webhook endpoints
   - Test payment processing

3. **✅ Integrate with Infrastructure**
   - Connect to domain and SSL setup
   - Configure CDN and caching
   - Enable production monitoring

---

**Your production Supabase will be identical to your local setup but with enterprise-grade security, monitoring, and scalability!** 🗄️

*Estimated completion time: 2-4 hours*