#!/bin/bash

# UK ETA Backend Setup Script
# This script sets up the complete backend with security

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}     🏛️  UK ETA Backend Setup Script                    ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to generate secure keys
generate_key() {
    openssl rand -hex 32
}

# Check requirements
echo -e "${YELLOW}📋 Checking requirements...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL client not found${NC}"
    echo "You'll need PostgreSQL installed or use a cloud database"
    echo ""
    read -p "Do you have a PostgreSQL database URL? (y/n): " has_db
    if [ "$has_db" != "y" ]; then
        echo -e "${RED}Please install PostgreSQL or get a database URL from:"
        echo "  - Supabase: https://supabase.com (free tier available)"
        echo "  - Railway: https://railway.app"
        echo "  - DigitalOcean: https://www.digitalocean.com${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ PostgreSQL client found${NC}"
fi

# Check OpenSSL
if ! command -v openssl &> /dev/null; then
    echo -e "${RED}❌ OpenSSL is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ OpenSSL found${NC}"

echo ""
echo -e "${YELLOW}🔧 Starting configuration...${NC}"
echo ""

# Navigate to backend directory
cd backend 2>/dev/null || {
    echo -e "${YELLOW}Creating backend directory...${NC}"
    mkdir -p backend
    cd backend
}

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Create secure storage directory
mkdir -p secure-storage
chmod 700 secure-storage
echo -e "${GREEN}✓ Secure storage directory created${NC}"

# Create .env file
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}                 Configuration Setup                     ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Database configuration
echo -e "${YELLOW}1️⃣  Database Configuration${NC}"
read -p "Enter PostgreSQL URL (or press Enter to use local): " db_url
if [ -z "$db_url" ]; then
    read -p "Database name (uk_eta_db): " db_name
    db_name=${db_name:-uk_eta_db}
    read -p "Database user (postgres): " db_user
    db_user=${db_user:-postgres}
    read -sp "Database password: " db_pass
    echo ""
    read -p "Database host (localhost): " db_host
    db_host=${db_host:-localhost}
    read -p "Database port (5432): " db_port
    db_port=${db_port:-5432}
    db_url="postgresql://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}"
fi

# Generate security keys
echo ""
echo -e "${YELLOW}2️⃣  Generating Security Keys${NC}"
master_key=$(generate_key)
jwt_secret=$(generate_key)
echo -e "${GREEN}✓ Encryption keys generated${NC}"

# Frontend configuration
echo ""
echo -e "${YELLOW}3️⃣  Frontend Configuration${NC}"
read -p "Frontend URL (http://localhost:8080): " frontend_url
frontend_url=${frontend_url:-http://localhost:8080}

# Stripe configuration
echo ""
echo -e "${YELLOW}4️⃣  Stripe Payment Configuration${NC}"
echo "Get your keys from: https://dashboard.stripe.com/test/apikeys"
read -p "Stripe Secret Key (sk_test_...): " stripe_key
read -p "Stripe Price ID (optional): " stripe_price

# Email configuration
echo ""
echo -e "${YELLOW}5️⃣  Email Configuration${NC}"
echo "For Gmail: Use an App Password (not your regular password)"
echo "Enable 2FA and create app password at: https://myaccount.google.com/apppasswords"
read -p "Email service (gmail/outlook/custom): " email_service
read -p "Your email address: " email_from
read -p "Email password/app password: " email_pass

if [ "$email_service" = "gmail" ]; then
    email_host="smtp.gmail.com"
    email_port="587"
elif [ "$email_service" = "outlook" ]; then
    email_host="smtp.office365.com"
    email_port="587"
else
    read -p "SMTP host: " email_host
    read -p "SMTP port: " email_port
fi

# Admin configuration
echo ""
echo -e "${YELLOW}6️⃣  Admin Account Configuration${NC}"
read -p "Admin email: " admin_email
read -sp "Admin password (min 8 characters): " admin_pass
echo ""

# Port configuration
read -p "Backend port (3001): " port
port=${port:-3001}

# Create .env file
cat > .env << EOF
# Database Configuration
DATABASE_URL=${db_url}

# Security Keys (Auto-generated)
MASTER_ENCRYPTION_KEY=${master_key}
JWT_SECRET=${jwt_secret}

# Frontend URL
FRONTEND_URL=${frontend_url}

# Stripe Configuration
STRIPE_SECRET_KEY=${stripe_key}
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=${stripe_price}

# Email Configuration
EMAIL_FROM=${email_from}
EMAIL_HOST=${email_host}
EMAIL_PORT=${email_port}
EMAIL_USER=${email_from}
EMAIL_PASSWORD=${email_pass}

# Admin Configuration
ADMIN_EMAIL=${admin_email}
ADMIN_PASSWORD=${admin_pass}

# Application Settings
PORT=${port}
NODE_ENV=production
SESSION_TIMEOUT=1800000
MAX_FILE_SIZE=5242880
VISA_FEE_GBP=42.00
EOF

echo -e "${GREEN}✓ Environment configuration saved${NC}"

# Initialize database
echo ""
echo -e "${YELLOW}7️⃣  Initializing Database${NC}"
echo "Creating tables and indexes..."

# Try to run database initialization
psql "$db_url" < src/db/schema.sql 2>/dev/null && {
    echo -e "${GREEN}✓ Database initialized successfully${NC}"
} || {
    echo -e "${YELLOW}⚠️  Could not automatically initialize database${NC}"
    echo "Please run the following command manually:"
    echo -e "${BLUE}psql \"$db_url\" < backend/src/db/schema.sql${NC}"
}

# Create admin user script
cat > create-admin.js << 'EOF'
import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createAdmin() {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        
        if (!email || !password || password.length < 8) {
            console.error('Invalid admin credentials');
            process.exit(1);
        }
        
        const passwordHash = await bcrypt.hash(password, 12);
        
        await pool.query(`
            INSERT INTO admin_users (id, email, password_hash, role, is_active)
            VALUES ($1, $2, $3, 'admin', true)
            ON CONFLICT (email) DO UPDATE
            SET password_hash = $3, updated_at = CURRENT_TIMESTAMP
        `, [uuidv4(), email, passwordHash]);
        
        console.log('✓ Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to create admin:', error);
        process.exit(1);
    }
}

createAdmin();
EOF

# Try to create admin user
echo ""
echo -e "${YELLOW}Creating admin user...${NC}"
node create-admin.js 2>/dev/null && {
    echo -e "${GREEN}✓ Admin user created${NC}"
} || {
    echo -e "${YELLOW}⚠️  Could not create admin user automatically${NC}"
    echo "Run: npm run create-admin"
}

# Create start script
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting UK ETA Backend..."
echo ""

# Check if secure-storage directory exists
if [ ! -d "secure-storage" ]; then
    mkdir -p secure-storage
    chmod 700 secure-storage
fi

# Start the server
NODE_ENV=production node src/server.js
EOF

chmod +x start.sh

# Create development script
cat > dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting UK ETA Backend (Development Mode)..."
NODE_ENV=development npx nodemon src/server.js
EOF

chmod +x dev.sh

# Summary
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}           ✅ Setup Complete!                           ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📋 Configuration Summary:${NC}"
echo "   • Database: Configured"
echo "   • Encryption: AES-256-GCM enabled"
echo "   • Admin Email: ${admin_email}"
echo "   • Backend Port: ${port}"
echo "   • Frontend URL: ${frontend_url}"
echo ""
echo -e "${BLUE}🔒 Security Features:${NC}"
echo "   • Military-grade file encryption"
echo "   • Database field encryption"
echo "   • Rate limiting enabled"
echo "   • CORS configured"
echo "   • Security headers active"
echo ""
echo -e "${BLUE}🚀 To start the backend:${NC}"
echo -e "   Production:  ${YELLOW}cd backend && ./start.sh${NC}"
echo -e "   Development: ${YELLOW}cd backend && ./dev.sh${NC}"
echo ""
echo -e "${BLUE}🌐 Endpoints:${NC}"
echo "   • Health Check: http://localhost:${port}/api/health"
echo "   • Submit Application: POST /api/applications/submit"
echo "   • Track Application: GET /api/track/:code"
echo "   • Admin Login: POST /api/admin/login"
echo ""
echo -e "${BLUE}📱 User Tracking Portal:${NC}"
echo "   Users can track their application at:"
echo "   ${frontend_url}/track"
echo ""
echo -e "${BLUE}👨‍💼 Admin Dashboard:${NC}"
echo "   Access the admin panel at:"
echo "   ${frontend_url}/admin"
echo "   Email: ${admin_email}"
echo ""
echo -e "${YELLOW}⚠️  Important Next Steps:${NC}"
echo "1. Set up Stripe webhook endpoint in Stripe Dashboard"
echo "2. Update frontend .env with: VITE_BACKEND_URL=http://localhost:${port}"
echo "3. Test the payment flow with Stripe test cards"
echo "4. Configure domain and SSL for production"
echo ""
echo -e "${GREEN}Your backend is ready for secure visa application processing!${NC}"