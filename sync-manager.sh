#!/bin/bash

# UK ETA Gateway - Auto Sync Manager
echo "🔄 UK ETA Gateway - Auto Sync Manager"
echo "====================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo -e "${BLUE}Usage: $0 [command]${NC}"
    echo ""
    echo "Commands:"
    echo "  setup     - Install auto-sync hooks and configuration"
    echo "  sync      - Manual sync to GitHub"
    echo "  status    - Show sync status"
    echo "  deploy    - Force deployment sync"
    echo "  cleanup   - Clean up old branches and tags"
    echo "  disable   - Disable auto-sync"
    echo "  enable    - Enable auto-sync"
    echo ""
}

# Function to setup auto-sync
setup_auto_sync() {
    echo -e "${YELLOW}🔧 Setting up auto-sync...${NC}"
    
    # Make hooks executable
    chmod +x .githooks/pre-commit 2>/dev/null || echo "No pre-commit hook found"
    chmod +x .githooks/post-commit 2>/dev/null || echo "No post-commit hook found"
    
    # Configure Git hooks
    git config core.hooksPath .githooks
    
    # Configure auto-push
    git config push.autoSetupRemote true
    
    # Create sync config
    cat > .sync-config << EOF
# Auto-sync configuration
AUTO_SYNC_ENABLED=true
AUTO_PUSH_MAIN=true
AUTO_CREATE_TAGS=true
SYNC_BRANCH=main
TARGET_REMOTE=origin
LAST_SYNC=$(date -Iseconds)
EOF
    
    echo -e "${GREEN}✅ Auto-sync setup completed!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Features enabled:${NC}"
    echo "  • Automatic push on commits to main"
    echo "  • Pre-commit quality checks"
    echo "  • GitHub Actions CI/CD"
    echo "  • Branch management"
    echo "  • Release tagging"
}

# Function to manual sync
manual_sync() {
    echo -e "${YELLOW}📤 Manual sync to GitHub...${NC}"
    
    BRANCH=$(git branch --show-current)
    echo "Current branch: $BRANCH"
    
    # Check for uncommitted changes
    if ! git diff --quiet || ! git diff --staged --quiet; then
        echo -e "${RED}❌ You have uncommitted changes${NC}"
        echo "Please commit your changes first:"
        echo "  git add ."
        echo "  git commit -m 'your message'"
        exit 1
    fi
    
    # Sync to remote
    echo "Pushing $BRANCH to origin..."
    if git push origin "$BRANCH"; then
        echo -e "${GREEN}✅ Successfully synced $BRANCH${NC}"
        
        # Create tag if on main
        if [ "$BRANCH" = "main" ]; then
            TAG="sync-$(date +'%Y%m%d-%H%M%S')"
            git tag "$TAG"
            git push origin "$TAG"
            echo -e "${GREEN}🏷️  Created tag: $TAG${NC}"
        fi
    else
        echo -e "${RED}❌ Failed to sync${NC}"
        exit 1
    fi
}

# Function to show sync status
show_status() {
    echo -e "${BLUE}📊 Sync Status${NC}"
    echo "=============="
    echo ""
    
    # Git status
    echo -e "${YELLOW}Git Status:${NC}"
    git status --porcelain
    echo ""
    
    # Branch info
    echo -e "${YELLOW}Branch Info:${NC}"
    echo "Current branch: $(git branch --show-current)"
    echo "Last commit: $(git log -1 --pretty=format:'%h - %s (%cr)')"
    echo ""
    
    # Remote status
    echo -e "${YELLOW}Remote Status:${NC}"
    git remote -v
    echo ""
    
    # Check if ahead/behind
    git fetch origin --quiet
    AHEAD=$(git rev-list --count HEAD..origin/$(git branch --show-current) 2>/dev/null || echo "0")
    BEHIND=$(git rev-list --count origin/$(git branch --show-current)..HEAD 2>/dev/null || echo "0")
    
    if [ "$AHEAD" -gt 0 ]; then
        echo -e "${RED}⬇️  Behind remote by $AHEAD commits${NC}"
    fi
    
    if [ "$BEHIND" -gt 0 ]; then
        echo -e "${YELLOW}⬆️  Ahead of remote by $BEHIND commits${NC}"
    fi
    
    if [ "$AHEAD" -eq 0 ] && [ "$BEHIND" -eq 0 ]; then
        echo -e "${GREEN}✅ In sync with remote${NC}"
    fi
    
    # Auto-sync status
    if [ -f ".sync-config" ]; then
        echo ""
        echo -e "${YELLOW}Auto-sync Config:${NC}"
        cat .sync-config | grep -E "AUTO_SYNC_ENABLED|LAST_SYNC"
    fi
}

# Function to force deployment
force_deploy() {
    echo -e "${YELLOW}🚀 Force deployment sync...${NC}"
    
    # Ensure we're on main
    if [ "$(git branch --show-current)" != "main" ]; then
        echo -e "${RED}❌ Must be on main branch for deployment${NC}"
        exit 1
    fi
    
    # Create deployment tag
    DEPLOY_TAG="deploy-$(date +'%Y%m%d-%H%M%S')"
    git tag -a "$DEPLOY_TAG" -m "Force deployment: $DEPLOY_TAG"
    git push origin "$DEPLOY_TAG"
    
    echo -e "${GREEN}✅ Deployment tag created: $DEPLOY_TAG${NC}"
    echo "This will trigger GitHub Actions deployment workflow"
}

# Function to cleanup
cleanup_repo() {
    echo -e "${YELLOW}🧹 Cleaning up repository...${NC}"
    
    # Remove local merged branches
    git branch --merged main | grep -v "main\|master" | xargs -n 1 git branch -d 2>/dev/null || true
    
    # Clean up remote tracking references
    git remote prune origin
    
    echo -e "${GREEN}✅ Repository cleaned up${NC}"
}

# Function to disable auto-sync
disable_auto_sync() {
    echo -e "${YELLOW}⏸️  Disabling auto-sync...${NC}"
    
    # Disable hooks
    git config --unset core.hooksPath 2>/dev/null || true
    
    # Update config
    sed -i 's/AUTO_SYNC_ENABLED=true/AUTO_SYNC_ENABLED=false/' .sync-config 2>/dev/null || true
    
    echo -e "${GREEN}✅ Auto-sync disabled${NC}"
}

# Function to enable auto-sync
enable_auto_sync() {
    echo -e "${YELLOW}▶️  Enabling auto-sync...${NC}"
    
    # Enable hooks
    git config core.hooksPath .githooks
    
    # Update config
    sed -i 's/AUTO_SYNC_ENABLED=false/AUTO_SYNC_ENABLED=true/' .sync-config 2>/dev/null || true
    
    echo -e "${GREEN}✅ Auto-sync enabled${NC}"
}

# Main script logic
case "$1" in
    "setup")
        setup_auto_sync
        ;;
    "sync")
        manual_sync
        ;;
    "status")
        show_status
        ;;
    "deploy")
        force_deploy
        ;;
    "cleanup")
        cleanup_repo
        ;;
    "disable")
        disable_auto_sync
        ;;
    "enable")
        enable_auto_sync
        ;;
    *)
        show_usage
        ;;
esac
