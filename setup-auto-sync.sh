#!/bin/bash

echo "🔧 Setting up Git Auto-Sync"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Make hooks executable
chmod +x .githooks/pre-commit
chmod +x .githooks/post-commit

# Configure Git to use our hooks directory
git config core.hooksPath .githooks

echo -e "${GREEN}✅ Git hooks installed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Auto-sync features enabled:${NC}"
echo ""
echo "🔄 Local Git Hooks:"
echo "  • Pre-commit: Runs tests before each commit"
echo "  • Post-commit: Auto-pushes main branch commits to GitHub"
echo ""
echo "🌍 GitHub Actions (auto-sync.yml):"
echo "  • Builds and tests on every push"
echo "  • Creates deployment branch automatically"
echo "  • Tags releases with timestamps"
echo "  • Runs on push to main/develop branches"
echo ""
echo -e "${GREEN}🚀 How it works:${NC}"
echo "1. Make changes to your code"
echo "2. Commit: git commit -m 'your message'"
echo "3. Changes automatically sync to GitHub"
echo "4. GitHub Actions build and deploy"
echo ""
echo -e "${YELLOW}⚙️  Manual sync commands:${NC}"
echo "  git add . && git commit -m 'message'  # Auto-syncs"
echo "  git push origin main                  # Manual sync"
echo ""
echo -e "${GREEN}✨ Setup complete! Your repository now auto-syncs with every commit.${NC}"
