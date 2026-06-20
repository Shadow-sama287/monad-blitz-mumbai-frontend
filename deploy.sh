#!/bin/bash
# Quick deployment helper script

echo "🚀 Agent Court Deployment Helper"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Install from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Detect platform
if [ -d ".git" ]; then
    echo "📦 Git repository detected"
    echo ""
    echo "Choose deployment option:"
    echo "1) Local Development"
    echo "2) Vercel (Frontend)"
    echo "3) Railway (Backend)"
    echo "4) Render (Full Stack)"
    echo ""
    read -p "Enter choice (1-4): " choice
    
    case $choice in
        1)
            echo "🏠 Setting up local development..."
            npm install
            cd backend
            npm install
            cd ..
            echo ""
            echo "📝 Configure environment variables:"
            echo "   cp .env.example .env.local"
            echo "   cp backend/.env.example backend/.env"
            echo ""
            echo "▶️ Start development:"
            echo "   Terminal 1: cd backend && npm run dev"
            echo "   Terminal 2: npm run dev"
            ;;
        2)
            echo "🌐 Deploying frontend to Vercel..."
            if ! command -v vercel &> /dev/null; then
                echo "Installing Vercel CLI..."
                npm install -g vercel
            fi
            vercel --prod
            echo "✅ Frontend deployed!"
            ;;
        3)
            echo "🚂 Deploying backend to Railway..."
            if ! command -v railway &> /dev/null; then
                echo "Installing Railway CLI..."
                npm install -g @railway/cli
            fi
            cd backend
            railway login
            railway init
            railway up
            echo "✅ Backend deployed! Copy the URL and update VITE_BACKEND_URL"
            ;;
        4)
            echo "📦 Deploying to Render..."
            echo "1. Push code to GitHub:"
            echo "   git add ."
            echo "   git commit -m 'Ready for deployment'"
            echo "   git push origin main"
            echo ""
            echo "2. Go to https://render.com"
            echo "3. Click 'New +' → 'Web Service'"
            echo "4. Select your GitHub repo"
            echo "5. Configure:"
            echo "   Build: npm install && cd backend && npm install && cd .."
            echo "   Start: cd backend && npm run start"
            echo "6. Add environment variables and deploy!"
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
else
    echo "❌ Not in project root directory"
    exit 1
fi

echo ""
echo "📚 Full guide: see DEPLOYMENT.md"
