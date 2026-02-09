@echo off
REM Iyara Side Restaurant - One-Command Deployment (Windows)
REM Frontend-Only Engine with Complete Transaction Pipeline

echo.
echo ============================================
echo   IYARA SIDE RESTAURANT - DEPLOYMENT
echo ============================================
echo.

echo Step 1: Building production bundle...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed! Please fix errors and try again.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Build complete!
echo.
echo ============================================
echo   DEPLOYMENT OPTIONS
echo ============================================
echo.
echo Option A: Netlify Drag and Drop (Easiest)
echo   1. Opening Netlify in your browser...
echo   2. Drag the 'dist' folder to upload
echo   3. Your site will be live in ~30 seconds!
echo.
echo Option B: Netlify CLI
echo   Run: netlify deploy --prod --dir=dist
echo.
echo ============================================
echo   WHAT'S DEPLOYED
echo ============================================
echo   [+] Complete transaction pipeline
echo   [+] Live CEO and Staff dashboards
echo   [+] WhatsApp + Telegram routing
echo   [+] QR-code table assignment
echo   [+] Role-based authentication
echo.
echo ============================================
echo   POST-DEPLOYMENT CHECKLIST
echo ============================================
echo   [ ] Generate QR codes for tables
echo   [ ] Share CEO login PIN: 1234
echo   [ ] Test customer ordering flow
echo   [ ] Test staff dashboard access
echo   [ ] Verify WhatsApp routing
echo.
echo See FRONTEND_DEPLOYMENT.md for full guide
echo.

REM Open Netlify deployment page
start https://app.netlify.com/drop

echo.
echo Opening Netlify deployment page...
echo.
pause
