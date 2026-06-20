@echo off
REM Quick deployment helper script for Windows

echo.
echo 🚀 Agent Court Deployment Helper
echo ==================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not installed. Install from https://nodejs.org
    exit /b 1
)

echo ✅ Node.js: 
node --version
echo ✅ npm: 
npm --version
echo.

REM Check git
if exist ".git" (
    echo 📦 Git repository detected
    echo.
    echo Choose deployment option:
    echo 1) Local Development
    echo 2) Vercel (Frontend)
    echo 3) Railway (Backend)
    echo 4) Render (Full Stack)
    echo.
    set /p choice="Enter choice (1-4): "
    
    if "%choice%"=="1" (
        echo 🏠 Setting up local development...
        call npm install
        cd backend
        call npm install
        cd ..
        echo.
        echo 📝 Configure environment variables:
        echo    cp .env.example .env.local
        echo    cp backend\.env.example backend\.env
        echo.
        echo ▶️ Start development:
        echo    Terminal 1: cd backend ^&^& npm run dev
        echo    Terminal 2: npm run dev
    ) else if "%choice%"=="2" (
        echo 🌐 Deploying frontend to Vercel...
        where vercel >nul 2>&1
        if %errorlevel% neq 0 (
            echo Installing Vercel CLI...
            call npm install -g vercel
        )
        call vercel --prod
        echo ✅ Frontend deployed!
    ) else if "%choice%"=="3" (
        echo 🚂 Deploying backend to Railway...
        where railway >nul 2>&1
        if %errorlevel% neq 0 (
            echo Installing Railway CLI...
            call npm install -g @railway/cli
        )
        cd backend
        call railway login
        call railway init
        call railway up
        echo ✅ Backend deployed! Copy the URL and update VITE_BACKEND_URL
    ) else if "%choice%"=="4" (
        echo 📦 Deploying to Render...
        echo 1. Push code to GitHub:
        echo    git add .
        echo    git commit -m "Ready for deployment"
        echo    git push origin main
        echo.
        echo 2. Go to https://render.com
        echo 3. Click 'New +' ^→ 'Web Service'
        echo 4. Select your GitHub repo
        echo 5. Configure:
        echo    Build: npm install ^&^& cd backend ^&^& npm install ^&^& cd ..
        echo    Start: cd backend ^&^& npm run start
        echo 6. Add environment variables and deploy!
    ) else (
        echo Invalid choice
        exit /b 1
    )
) else (
    echo ❌ Not in project root directory
    exit /b 1
)

echo.
echo 📚 Full guide: see DEPLOYMENT.md
