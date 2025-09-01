#!/bin/bash

echo "🗄️  Setting up Supabase Database for UK ETA Gateway"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Supabase CLI is available
if ! command -v npx supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo "Installing Supabase CLI..."
    npm install -D supabase
fi

echo -e "${YELLOW}📋 Setup Options:${NC}"
echo "1. Start local Supabase (for development)"
echo "2. Link to existing Supabase project"
echo "3. Create new Supabase project"
echo "4. Run migrations only"
echo "5. Generate TypeScript types"
echo ""

read -p "Choose an option (1-5): " option

case $option in
    1)
        echo -e "${YELLOW}🚀 Starting local Supabase...${NC}"
        npx supabase start
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Local Supabase started successfully!${NC}"
            echo ""
            echo -e "${BLUE}📋 Local Development URLs:${NC}"
            echo "API URL: http://localhost:54321"
            echo "Database URL: postgresql://postgres:postgres@localhost:54322/postgres"
            echo "Studio URL: http://localhost:54323"
            echo ""
            echo -e "${YELLOW}🔧 Update your .env file:${NC}"
            echo "VITE_SUPABASE_URL=http://localhost:54321"
            echo "VITE_SUPABASE_ANON_KEY=(check the output above for anon key)"
        else
            echo -e "${RED}❌ Failed to start local Supabase${NC}"
            exit 1
        fi
        ;;
        
    2)
        echo -e "${YELLOW}🔗 Linking to existing Supabase project...${NC}"
        echo ""
        echo "You'll need your Supabase project reference ID"
        echo "Find it at: https://app.supabase.com/projects"
        echo ""
        
        read -p "Enter your project reference ID: " project_ref
        
        if [ -n "$project_ref" ]; then
            npx supabase link --project-ref "$project_ref"
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Successfully linked to project: $project_ref${NC}"
                
                # Run migrations
                echo -e "${YELLOW}📤 Pushing database migrations...${NC}"
                npx supabase db push
                
                echo -e "${YELLOW}🔧 Update your .env file with:${NC}"
                echo "VITE_SUPABASE_URL=https://$project_ref.supabase.co"
                echo "VITE_SUPABASE_ANON_KEY=(get from project settings)"
            else
                echo -e "${RED}❌ Failed to link project${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ Project reference ID is required${NC}"
            exit 1
        fi
        ;;
        
    3)
        echo -e "${YELLOW}🆕 Creating new Supabase project...${NC}"
        echo ""
        echo "This will open the Supabase dashboard in your browser"
        echo "Create a new project and then come back to link it"
        echo ""
        
        read -p "Press Enter to open Supabase dashboard..."
        "$BROWSER" "https://app.supabase.com/new" 2>/dev/null || \
        xdg-open "https://app.supabase.com/new" 2>/dev/null || \
        open "https://app.supabase.com/new" 2>/dev/null
        
        echo ""
        echo "After creating your project:"
        echo "1. Note your project reference ID"
        echo "2. Run this script again with option 2 to link"
        ;;
        
    4)
        echo -e "${YELLOW}📤 Running database migrations...${NC}"
        
        # Check if linked to a project
        if [ -f ".supabase/config.toml" ]; then
            npx supabase db push
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Migrations applied successfully${NC}"
            else
                echo -e "${RED}❌ Failed to apply migrations${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ Not linked to a Supabase project${NC}"
            echo "Please link to a project first (option 2)"
            exit 1
        fi
        ;;
        
    5)
        echo -e "${YELLOW}🔧 Generating TypeScript types...${NC}"
        
        # Generate types
        npx supabase gen types typescript --local > src/types/supabase.ts 2>/dev/null || \
        npx supabase gen types typescript > src/types/supabase.ts
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ TypeScript types generated: src/types/supabase.ts${NC}"
        else
            echo -e "${RED}❌ Failed to generate types${NC}"
            echo "Make sure you're linked to a project or have local Supabase running"
        fi
        ;;
        
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Supabase setup completed!${NC}"
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo "1. Update your .env file with Supabase credentials"
echo "2. Test the connection by running: npm run dev"
echo "3. Visit the Supabase Studio to manage your database"
echo ""
echo -e "${YELLOW}📖 Documentation:${NC}"
echo "• Supabase Docs: https://supabase.com/docs"
echo "• TypeScript Guide: https://supabase.com/docs/guides/with-react"
echo "• UK ETA Gateway: See SUPABASE_README.md"
