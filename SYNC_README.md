# 🔄 Auto-Sync System

The UK ETA Gateway repository is equipped with a comprehensive auto-sync system that automatically synchronizes your code changes with GitHub and manages deployments.

## ✨ Features

### 🔄 Automatic Synchronization
- **Auto-push**: Commits to `main` branch automatically push to GitHub
- **Pre-commit checks**: Runs tests and quality checks before commits
- **Branch management**: Automatically creates staging and production branches
- **Release tagging**: Auto-generates timestamped release tags

### 🌍 GitHub Actions CI/CD
- **Quality checks**: Linting, type checking, testing on every push
- **Multi-branch support**: Handles main, develop, and feature branches
- **Auto-deployment**: Creates deployment-ready branches
- **Cleanup**: Automatically removes old branches and tags

### 🛠️ Management Tools
- **Sync Manager**: Command-line tool for manual operations
- **Status monitoring**: Real-time sync status
- **Enable/disable**: Toggle auto-sync features
- **Force deployment**: Manual deployment triggers

## 🚀 Quick Start

### Initial Setup
```bash
# Already done during repository setup
./setup-auto-sync.sh
```

### Daily Usage
```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
# ✅ Automatically syncs to GitHub!
```

### Manual Operations
```bash
# Check sync status
./sync-manager.sh status

# Manual sync
./sync-manager.sh sync

# Force deployment
./sync-manager.sh deploy

# Clean up old branches
./sync-manager.sh cleanup
```

## 📋 How It Works

### 1. Local Git Hooks
**Pre-commit Hook** (`.githooks/pre-commit`):
- Runs tests if available
- Checks code quality
- Validates commit readiness

**Post-commit Hook** (`.githooks/post-commit`):
- Auto-pushes main branch commits
- Creates sync notifications
- Updates sync status

### 2. GitHub Actions Workflows

**Auto-Sync Workflow** (`.github/workflows/auto-sync.yml`):
```yaml
Triggers: Push to main/develop, Pull requests
Actions:
  ✅ Install dependencies
  ✅ Run tests
  ✅ Build application
  ✅ Create deployment branch
  ✅ Tag releases
```

**Advanced Sync** (`.github/workflows/advanced-sync.yml`):
```yaml
Features:
  🔄 Hourly auto-sync
  🎯 Quality gates
  🚀 Multi-environment deployment
  🧹 Automatic cleanup
  🤖 Auto-merge approved PRs
```

### 3. Branch Strategy
```
main (production-ready)
├── staging (pre-production)
├── develop (development)
└── feature/* (feature branches)
```

## ⚙️ Configuration

### Sync Settings
The `.sync-config` file controls auto-sync behavior:
```bash
AUTO_SYNC_ENABLED=true
AUTO_PUSH_MAIN=true
AUTO_CREATE_TAGS=true
SYNC_BRANCH=main
TARGET_REMOTE=origin
```

### Disable/Enable Auto-Sync
```bash
# Disable auto-sync
./sync-manager.sh disable

# Enable auto-sync
./sync-manager.sh enable
```

## 🔧 Troubleshooting

### Common Issues

**Sync Fails with Permission Error**:
```bash
# Re-authenticate with GitHub
gh auth login --web
```

**Hooks Not Running**:
```bash
# Reinstall hooks
git config core.hooksPath .githooks
chmod +x .githooks/*
```

**Behind Remote Commits**:
```bash
# Check status and pull
./sync-manager.sh status
git pull origin main
```

### Manual Recovery
```bash
# Force push (use carefully!)
git push origin main --force-with-lease

# Reset to remote
git reset --hard origin/main
```

## 📊 Monitoring

### Check Sync Status
```bash
./sync-manager.sh status
```

### GitHub Actions
- Visit: `https://github.com/Humbl-club/not-my-app-/actions`
- Monitor workflow runs
- Check deployment status

### Branch Protection
Recommended GitHub settings:
- ✅ Require status checks
- ✅ Require branches to be up to date
- ✅ Require pull request reviews
- ✅ Dismiss stale reviews

## 🔐 Security

### Token Management
- Uses GitHub CLI authentication
- Scoped access tokens
- Automatic token refresh

### Branch Protection
- Main branch protected
- Required status checks
- Review requirements
- Force push prevention

## 📚 Commands Reference

### Sync Manager Commands
```bash
./sync-manager.sh setup     # Install auto-sync
./sync-manager.sh sync      # Manual sync
./sync-manager.sh status    # Show status
./sync-manager.sh deploy    # Force deployment
./sync-manager.sh cleanup   # Clean repository
./sync-manager.sh disable   # Disable auto-sync
./sync-manager.sh enable    # Enable auto-sync
```

### Git Commands
```bash
git status                  # Check working directory
git log --oneline -10       # Recent commits
git remote -v              # Remote repositories
git branch -vv             # Branch tracking info
```

## 🎯 Best Practices

1. **Commit Frequently**: Small, focused commits work best
2. **Use Descriptive Messages**: Clear commit messages help tracking
3. **Test Locally**: Run tests before committing
4. **Keep Main Clean**: Use feature branches for development
5. **Monitor Actions**: Check GitHub Actions for any issues

## 🆘 Support

For issues with the auto-sync system:
1. Check `./sync-manager.sh status`
2. Review GitHub Actions logs
3. Verify GitHub authentication
4. Ensure proper branch permissions

---

*Auto-sync system configured for UK ETA Gateway - Commit with confidence! 🚀*
