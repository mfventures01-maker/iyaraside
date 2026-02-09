# Iyarà Side Restaurant - One-Command Deployment (Windows)
# Frontend-Only Engine with Complete Transaction Pipeline

Write-Host "🍽️  IYARÀ SIDE RESTAURANT - DEPLOYMENT SCRIPT" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""

# Step 1: Build Check
Write-Host "📦 Step 1: Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 Build Statistics:" -ForegroundColor Cyan
Write-Host "└── Bundle size: ~300 kB (gzipped: ~87 kB)"
Write-Host "└── Build time: ~30-60 seconds"
Write-Host "└── Output directory: dist/"

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "🚀 DEPLOYMENT OPTIONS" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Option A: Netlify Drag & Drop (Easiest)" -ForegroundColor Yellow
Write-Host "  1. Go to https://app.netlify.com"
Write-Host "  2. Click 'Add new site' → 'Deploy manually'"
Write-Host "  3. Drag the 'dist' folder to the upload area"
Write-Host "  4. Your site will be live in ~30 seconds!"
Write-Host ""
Write-Host "Option B: Netlify CLI (If installed)" -ForegroundColor Yellow
Write-Host "  Run: netlify deploy --prod --dir=dist"
Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "✨ WHAT'S DEPLOYED" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "✅ Complete transaction pipeline (CARSS Protocol)"
Write-Host "✅ Live CEO & Staff dashboards"
Write-Host "✅ WhatsApp + Telegram routing"
Write-Host "✅ QR-code table assignment"
Write-Host "✅ Role-based authentication"
Write-Host "✅ Real-time order tracking"
Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "📋 POST-DEPLOYMENT CHECKLIST" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "⬜ Generate QR codes for tables (/?table=1, /?table=2, etc.)"
Write-Host "⬜ Share staff login credentials (CEO PIN: 1234)"
Write-Host "⬜ Test customer ordering flow"
Write-Host "⬜ Test staff dashboard access"
Write-Host "⬜ Verify WhatsApp message routing"
Write-Host ""
Write-Host "📖 Full deployment guide: FRONTEND_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Build complete! Ready to deploy." -ForegroundColor Green
Write-Host ""
Write-Host "Opening Netlify deployment page in browser..." -ForegroundColor Yellow

Start-Process "https://app.netlify.com/drop"
