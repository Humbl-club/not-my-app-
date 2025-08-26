#!/bin/bash

# UK ETA Gateway - Backend Setup Script
# This script sets up the secure backend infrastructure

echo "🚀 UK ETA Gateway - Backend Infrastructure Setup"
echo "================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run this script as root!${NC}"
   exit 1
fi

# Create backend directory structure
echo -e "\n${YELLOW}1. Creating backend directory structure...${NC}"
mkdir -p backend/{src,tests,config,migrations,scripts}
mkdir -p backend/src/{controllers,services,models,middleware,utils,validators}
mkdir -p backend/config/{development,production,test}

# Initialize package.json for backend
echo -e "\n${YELLOW}2. Initializing Node.js backend...${NC}"
cd backend
cat > package.json << 'EOF'
{
  "name": "uk-eta-gateway-backend",
  "version": "1.0.0",
  "description": "Secure backend for UK ETA Gateway",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "migrate": "knex migrate:latest",
    "seed": "knex seed:run",
    "security-check": "npm audit && snyk test"
  },
  "dependencies": {
    "@fastify/cors": "^10.0.1",
    "@fastify/helmet": "^12.0.1",
    "@fastify/multipart": "^9.0.1",
    "@fastify/rate-limit": "^10.1.1",
    "@fastify/session": "^11.0.1",
    "@fastify/static": "^8.0.2",
    "@aws-sdk/client-s3": "^3.700.0",
    "@aws-sdk/client-kms": "^3.700.0",
    "argon2": "^0.41.1",
    "fastify": "^5.1.0",
    "ioredis": "^5.4.2",
    "jsonwebtoken": "^9.0.2",
    "knex": "^3.1.0",
    "pg": "^8.13.1",
    "pino": "^9.5.0",
    "sharp": "^0.33.5",
    "stripe": "^17.5.0",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "@types/node": "^22.12.0",
    "tsx": "^4.19.2",
    "typescript": "^5.8.3",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.14",
    "snyk": "^1.1266.0"
  }
}
EOF

echo -e "${GREEN}✓ Package.json created${NC}"

# Create TypeScript configuration
echo -e "\n${YELLOW}3. Setting up TypeScript configuration...${NC}"
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

echo -e "${GREEN}✓ TypeScript configured${NC}"

# Create environment template
echo -e "\n${YELLOW}4. Creating environment configuration...${NC}"
cat > .env.example << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uk_eta_gateway
DB_USER=eta_user
DB_PASSWORD=CHANGE_ME_SECURE_PASSWORD
DB_SSL=true

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_ME_SECURE_PASSWORD

# AWS Configuration
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
S3_BUCKET=uk-eta-documents
KMS_KEY_ID=CHANGE_ME

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_CHANGE_ME
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_ME

# Security Configuration
JWT_SECRET=CHANGE_ME_64_CHAR_SECRET
ENCRYPTION_KEY=CHANGE_ME_32_BYTE_HEX_KEY
SESSION_SECRET=CHANGE_ME_64_CHAR_SECRET

# CORS Configuration
FRONTEND_URL=http://localhost:8080
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Email Configuration (Optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@uk-eta.gov.uk
SMTP_PASSWORD=CHANGE_ME
FROM_EMAIL=noreply@uk-eta.gov.uk
EOF

echo -e "${GREEN}✓ Environment template created${NC}"

# Create Docker compose for local development
echo -e "\n${YELLOW}5. Creating Docker Compose configuration...${NC}"
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: uk_eta_gateway
      POSTGRES_USER: eta_user
      POSTGRES_PASSWORD: development_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U eta_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass development_password
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  localstack:
    image: localstack/localstack
    environment:
      - SERVICES=s3,kms
      - DEFAULT_REGION=eu-west-2
      - DATA_DIR=/tmp/localstack/data
    ports:
      - "4566:4566"
    volumes:
      - localstack_data:/tmp/localstack

volumes:
  postgres_data:
  redis_data:
  localstack_data:
EOF

echo -e "${GREEN}✓ Docker Compose configured${NC}"

# Create basic server file
echo -e "\n${YELLOW}6. Creating basic server implementation...${NC}"
cat > src/server.ts << 'EOF'
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config';

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
  }
});

// Security plugins
await server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"]
    }
  }
});

await server.register(cors, {
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:8080'],
  credentials: true
});

await server.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes'
});

// Health check
server.get('/health', async () => {
  return { status: 'healthy', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    await server.listen({
      port: parseInt(process.env.PORT || '3000'),
      host: process.env.HOST || '0.0.0.0'
    });
    console.log(`✅ Server running on http://localhost:${process.env.PORT || 3000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
EOF

echo -e "${GREEN}✓ Basic server created${NC}"

# Create database migration
echo -e "\n${YELLOW}7. Creating database migration...${NC}"
mkdir -p migrations
cat > migrations/001_initial_schema.sql << 'EOF'
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(20) UNIQUE NOT NULL DEFAULT 'ETA' || to_char(now(), 'YYYYMMDD') || lpad(nextval('app_seq')::text, 6, '0'),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint VARCHAR(255),
  session_id VARCHAR(255),
  data JSONB DEFAULT '{}',
  payment_status VARCHAR(50),
  payment_intent_id VARCHAR(255),
  reference_number VARCHAR(50) UNIQUE,
  version INTEGER DEFAULT 1
);

-- Create sequence for application numbers
CREATE SEQUENCE IF NOT EXISTS app_seq START 1;

-- Indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_device ON applications(device_fingerprint);
CREATE INDEX idx_applications_created ON applications(created_at);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
EOF

echo -e "${GREEN}✓ Database migration created${NC}"

# Create security audit script
echo -e "\n${YELLOW}8. Creating security audit script...${NC}"
cat > scripts/security-audit.sh << 'EOF'
#!/bin/bash

echo "🔒 Running Security Audit..."
echo "============================"

# Check for vulnerabilities
echo "Checking npm packages..."
npm audit

# Check with Snyk if available
if command -v snyk &> /dev/null; then
    echo "Running Snyk security scan..."
    snyk test
fi

# Check for secrets in code
echo "Checking for secrets..."
grep -r "password\|secret\|key\|token" --exclude-dir=node_modules --exclude-dir=.git --exclude="*.example" .

# Check file permissions
echo "Checking file permissions..."
find . -type f -perm 0777 -exec ls -l {} \;

echo "Security audit complete!"
EOF

chmod +x scripts/security-audit.sh
echo -e "${GREEN}✓ Security audit script created${NC}"

# Final instructions
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Copy .env.example to .env and update values"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'docker-compose up -d' to start databases"
echo "4. Run 'npm run migrate' to create database schema"
echo "5. Run 'npm run dev' to start the server"

echo -e "\n${YELLOW}Security checklist:${NC}"
echo "□ Update all passwords in .env file"
echo "□ Generate secure JWT secret (openssl rand -base64 64)"
echo "□ Generate encryption key (openssl rand -hex 32)"
echo "□ Configure AWS credentials securely"
echo "□ Set up SSL/TLS certificates for production"
echo "□ Configure firewall rules"
echo "□ Enable database SSL"
echo "□ Set up monitoring and alerting"

echo -e "\n${GREEN}Happy coding! Remember: Security first! 🛡️${NC}"