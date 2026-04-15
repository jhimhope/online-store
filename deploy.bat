@echo off
echo 🚀 Online Store Deployment Script
echo =================================

REM Check if git is initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit: Online store with Supabase & Vercel"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📦 Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🔧 Checking environment variables...
if not exist ".env.local" (
    echo ❌ .env.local file not found!
    echo Please create .env.local with:
    echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    pause
    exit /b 1
) else (
    echo ✅ .env.local file found
)

echo.
echo 🔍 Testing build...
call npm run build
if %errorlevel% equ 0 (
    echo ✅ Build successful
) else (
    echo ❌ Build failed. Please check errors above.
    pause
    exit /b 1
)

echo.
echo 🚀 Ready to deploy!
echo.
echo Next steps:
echo 1. Push to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
echo    git push -u origin main
echo.
echo 2. Deploy to Vercel:
echo    - Go to https://vercel.com
echo    - Import your GitHub repository
echo    - Add environment variables:
echo      • NEXT_PUBLIC_SUPABASE_URL
echo      • NEXT_PUBLIC_SUPABASE_ANON_KEY
echo    - Click Deploy
echo.
echo 3. Set up Supabase:
echo    - Run migrations from supabase/migrations/
echo    - Configure Auth redirect URLs
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md
pause