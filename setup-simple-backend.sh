#!/bin/bash

echo "🚀 Setting up Simple UK ETA Backend"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm install express cors multer nodemailer
npm install -D nodemon

# Create applications directory
mkdir -p applications
echo -e "${GREEN}✓ Created applications directory${NC}"

# Create .env file for configuration
echo ""
echo -e "${YELLOW}⚙️  Configuration Required${NC}"
echo "========================="
echo ""
echo "Please enter your email configuration for receiving applications:"
echo ""

read -p "Enter your Gmail address: " email
read -sp "Enter your Gmail App Password (hidden): " password
echo ""
read -p "Enter port for backend (default 3001): " port

port=${port:-3001}

# Update the backend configuration
cat > backend-config.js << EOF
// Auto-generated configuration
export const CONFIG = {
  YOUR_EMAIL: '${email}',
  EMAIL_PASSWORD: '${password}',
  PORT: ${port}
};
EOF

echo -e "${GREEN}✓ Configuration saved${NC}"

# Create a simple start script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting UK ETA Backend..."
node backend-simple.js
EOF

chmod +x start-backend.sh

# Instructions
echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "To start the backend, run:"
echo -e "${YELLOW}  ./start-backend.sh${NC}"
echo ""
echo "Or for development with auto-restart:"
echo -e "${YELLOW}  npx nodemon backend-simple.js${NC}"
echo ""
echo "The backend will:"
echo "  • Accept form submissions on port ${port}"
echo "  • Email applications to: ${email}"
echo "  • Store files in: ./applications/"
echo ""
echo -e "${YELLOW}⚠️  Gmail Setup Required:${NC}"
echo "1. Enable 2-factor authentication in Gmail"
echo "2. Generate an App Password at: https://myaccount.google.com/apppasswords"
echo "3. Use the App Password (not your regular password)"
echo ""
echo -e "${GREEN}Frontend Integration:${NC}"
echo "Add to your frontend .env file:"
echo "  VITE_BACKEND_URL=http://localhost:${port}"