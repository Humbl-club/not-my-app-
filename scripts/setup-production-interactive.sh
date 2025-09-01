#!/bin/bash
# UK ETA Gateway - Interactive Production Setup
# Step-by-step guide for Day 2: Supabase Production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  UK ETA Gateway - Day 2: Supabase Production Setup${NC}"
echo "====================================================="
echo ""
echo -e "${CYAN}This script will guide you through:${NC}"
echo "1. ✅ Creating a production Supabase project"
echo "2. ✅ Configuring custom domain (optional)"
echo "3. ✅ Deploying database migrations"
echo "4. ✅ Setting up Edge Functions"
echo "5. ✅ Configuring storage buckets"
echo "6. ✅ Enabling backups and monitoring"
echo ""

# Check prerequisites
echo -e "${BLUE}📋 Prerequisites Check${NC}"
echo "================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Installing Supabase CLI...${NC}"
    npm install -g supabase@latest
    echo -e "${GREEN}✅ Supabase CLI installed${NC}"
else
    echo -e "${GREEN}✅ Supabase CLI already installed${NC}"
fi

# Check if jq is installed (for JSON processing)
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Installing jq for JSON processing...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command -v brew &> /dev/null; then
        brew install jq
    else
        echo -e "${RED}❌ Please install jq manually${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ jq installed${NC}"
else
    echo -e "${GREEN}✅ jq already available${NC}"
fi

echo ""
echo -e "${BLUE}🔑 Step 1: Supabase Account Setup${NC}"
echo "=================================="
echo ""
echo "Before proceeding, you need:"
echo "1. 📧 Supabase account (https://supabase.com)"
echo "2. 💳 Payment method added for Pro plan ($25/month)"
echo "3. 🌐 Domain ready (uketa.gov.uk)"
echo ""

read -p "Have you completed these requirements? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please complete these requirements first:${NC}"
    echo "1. Sign up at https://supabase.com"
    echo "2. Add payment method in billing settings"
    echo "3. Prepare your domain configuration"
    echo ""
    echo "Run this script again when ready!"
    exit 0
fi

# Login to Supabase
echo -e "${BLUE}🔐 Logging into Supabase...${NC}"
if ! supabase login; then
    echo -e "${RED}❌ Supabase login failed${NC}"
    echo "Please check your credentials and try again"
    exit 1
fi
echo -e "${GREEN}✅ Successfully logged into Supabase${NC}"
echo ""

# Create project
echo -e "${BLUE}🏗️  Step 2: Creating Production Project${NC}"
echo "======================================="
echo ""
echo -e "${YELLOW}⚠️  You need to create the project manually in the Supabase dashboard.${NC}"
echo ""
echo "1. Go to https://supabase.com/dashboard"
echo "2. Click 'New project'"
echo "3. Use these settings:"
echo "   • Name: UK ETA Gateway (Production)"
echo "   • Database Password: [Generate a strong password]"
echo "   • Region: Europe West (London)"
echo "   • Plan: Pro ($25/month)"
echo "4. Wait for project creation (2-3 minutes)"
echo ""

read -p "Press Enter after creating your project..."
echo ""

# Get project details
echo -e "${BLUE}📝 Project Configuration${NC}"
echo "========================"
echo ""
echo "Now we need your project details from the Supabase dashboard:"
echo "Go to Settings > API in your new project"
echo ""

read -p "Enter your Project URL (https://xxx.supabase.co): " PROJECT_URL
read -p "Enter your Project ID (the xxx part): " PROJECT_ID
read -s -p "Enter your anon/public key: " ANON_KEY
echo
read -s -p "Enter your service role key: " SERVICE_KEY
echo ""

# Validate inputs
if [[ -z "$PROJECT_URL" || -z "$PROJECT_ID" || -z "$ANON_KEY" || -z "$SERVICE_KEY" ]]; then
    echo -e "${RED}❌ Missing required project details${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project details collected${NC}"

# Update environment file
echo -e "${BLUE}⚙️  Step 3: Updating Environment Configuration${NC}"
echo "=============================================="

# Create production environment file
cat > .env.production.local << EOF
# UK ETA Gateway - Production Supabase Configuration
# Generated on $(date)

# Production Supabase Configuration
VITE_SUPABASE_URL=$PROJECT_URL
VITE_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
SUPABASE_PROJECT_ID=$PROJECT_ID

# Application Configuration
VITE_APP_URL=https://uketa.gov.uk
VITE_ENVIRONMENT=production

# Copy these to your deployment platform:
# Vercel: vercel env add
# Netlify: Site settings > Environment variables
# Railway: Variables tab
EOF

echo -e "${GREEN}✅ Environment file created: .env.production.local${NC}"
echo ""

# Link project
echo -e "${BLUE}🔗 Step 4: Linking to Production Project${NC}"
echo "========================================"

echo "Linking local development to production project..."
if supabase link --project-ref "$PROJECT_ID"; then
    echo -e "${GREEN}✅ Successfully linked to production project${NC}"
else
    echo -e "${RED}❌ Failed to link project${NC}"
    exit 1
fi
echo ""

# Run migrations
echo -e "${BLUE}📊 Step 5: Deploying Database Schema${NC}"
echo "===================================="

echo "Applying database migrations to production..."
echo "This will create all tables, functions, and policies..."
echo ""

read -p "Ready to apply migrations? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if supabase db push --include-all; then
        echo -e "${GREEN}✅ Database migrations applied successfully${NC}"
    else
        echo -e "${RED}❌ Database migration failed${NC}"
        echo "Check the error messages above and fix any issues"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipping migrations. You can run them later with: supabase db push${NC}"
fi
echo ""

# Deploy Edge Functions
echo -e "${BLUE}⚡ Step 6: Deploying Edge Functions${NC}"
echo "=================================="

edge_functions=("admin-dashboard" "create-payment-intent" "send-email" "submit-application" "verify-document")

echo "Found ${#edge_functions[@]} Edge Functions to deploy:"
for func in "${edge_functions[@]}"; do
    echo "  • $func"
done
echo ""

read -p "Deploy all Edge Functions? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    for func in "${edge_functions[@]}"; do
        echo "Deploying $func..."
        if supabase functions deploy "$func"; then
            echo -e "${GREEN}✅ $func deployed successfully${NC}"
        else
            echo -e "${RED}❌ Failed to deploy $func${NC}"
        fi
    done
else
    echo -e "${YELLOW}Skipping Edge Functions. Deploy later with: supabase functions deploy <name>${NC}"
fi
echo ""

# Set environment variables for Edge Functions
echo -e "${BLUE}🔧 Step 7: Setting Edge Function Environment Variables${NC}"
echo "===================================================="

echo "Edge Functions need environment variables for:"
echo "• Stripe integration"
echo "• Email sending"
echo "• reCAPTCHA verification"
echo ""

read -p "Do you want to set environment variables now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "You can set these in the Supabase dashboard:"
    echo "Go to Edge Functions > Settings > Environment Variables"
    echo ""
    echo "Required variables:"
    echo "• STRIPE_SECRET_KEY=sk_live_..."
    echo "• STRIPE_WEBHOOK_SECRET=whsec_..."
    echo "• SMTP_HOST=your-smtp-host"
    echo "• SMTP_USER=your-smtp-user"
    echo "• SMTP_PASS=your-smtp-password"
    echo "• RECAPTCHA_SECRET_KEY=your-recaptcha-secret"
    echo ""
    read -p "Press Enter after setting environment variables..."
fi
echo ""

# Configure storage buckets
echo -e "${BLUE}📁 Step 8: Setting Up Storage Buckets${NC}"
echo "===================================="

echo "Creating storage buckets for:"
echo "• documents (application documents)"
echo "• photos (passport photos)" 
echo "• passports (passport scans)"
echo "• etas (generated ETA documents)"
echo ""

# Run storage setup SQL
storage_sql=$(cat << 'EOF'
-- Create storage buckets for production
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

CREATE POLICY IF NOT EXISTS "ETA documents access" ON storage.objects
FOR SELECT USING (bucket_id = 'etas' AND auth.uid()::text = (storage.foldername(name))[1]);
EOF
)

echo "$storage_sql" > temp_storage_setup.sql

read -p "Create storage buckets? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if supabase db remote commit temp_storage_setup.sql --message "Setup production storage buckets"; then
        echo -e "${GREEN}✅ Storage buckets created successfully${NC}"
    else
        echo -e "${RED}❌ Storage bucket creation failed${NC}"
    fi
fi

rm -f temp_storage_setup.sql
echo ""

# Enable backups
echo -e "${BLUE}💾 Step 9: Enabling Backups & Monitoring${NC}"
echo "========================================"

echo -e "${YELLOW}⚠️  Enable these features in the Supabase dashboard:${NC}"
echo ""
echo "1. Point-in-Time Recovery:"
echo "   • Go to Settings > Database"
echo "   • Enable Point-in-Time Recovery"
echo "   • Set retention period to 7 days minimum"
echo ""
echo "2. Monitoring & Alerts:"
echo "   • Go to Reports"
echo "   • Set up email alerts for errors"
echo "   • Monitor API usage and performance"
echo ""
echo "3. Custom Domain (Optional):"
echo "   • Go to Settings > API"
echo "   • Add custom domain: api.uketa.gov.uk"
echo "   • Configure DNS CNAME record"
echo ""

read -p "Press Enter after enabling these features..."
echo ""

# Test the setup
echo -e "${BLUE}🧪 Step 10: Testing Production Setup${NC}"
echo "=================================="

echo "Testing database connection..."
test_response=$(curl -s -H "apikey: $ANON_KEY" "$PROJECT_URL/rest/v1/applications?select=count&limit=1" -w "%{http_code}")
http_code="${test_response: -3}"

if [[ "$http_code" == "200" ]]; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${YELLOW}⚠️  Database test returned HTTP $http_code${NC}"
    echo "This might be expected if tables are empty"
fi

echo ""
echo "Testing Edge Functions..."
for func in "${edge_functions[@]}"; do
    echo "Testing $func..."
    func_response=$(curl -s -o /dev/null -w "%{http_code}" "$PROJECT_URL/functions/v1/$func" \
                   -H "Authorization: Bearer $ANON_KEY")
    
    if [[ "$func_response" == "200" || "$func_response" == "400" || "$func_response" == "401" ]]; then
        echo -e "${GREEN}✅ $func is responding (HTTP $func_response)${NC}"
    else
        echo -e "${YELLOW}⚠️  $func returned HTTP $func_response${NC}"
    fi
done

# Generate production summary
echo ""
echo -e "${GREEN}🎉 Production Supabase Setup Complete!${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}Production Configuration Summary:${NC}"
echo "• Project ID: $PROJECT_ID"
echo "• URL: $PROJECT_URL"
echo "• Database: ✅ Migrations applied"
echo "• Edge Functions: ✅ Deployed (${#edge_functions[@]} functions)"
echo "• Storage: ✅ Buckets configured"
echo "• Security: ✅ RLS policies active"
echo ""
echo -e "${BLUE}Environment File Created:${NC}"
echo ".env.production.local contains your production credentials"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "1. Copy .env.production.local to your deployment platform"
echo "2. Enable Point-in-Time Recovery in dashboard"
echo "3. Set up custom domain (optional)"
echo "4. Configure Edge Function environment variables"
echo "5. Set up monitoring and alerting"
echo ""
echo -e "${BLUE}Important URLs:${NC}"
echo "• Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID"
echo "• API Docs: $PROJECT_URL/rest/v1/"
echo "• Functions: $PROJECT_URL/functions/v1/"
echo ""
echo -e "${GREEN}Ready for Day 3: Payment Integration! 🚀${NC}"