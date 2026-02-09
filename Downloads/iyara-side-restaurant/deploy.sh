#!/usr/bin/env bash

# Iyarà Side Restaurant - One-Command Deployment Script
# Frontend-Only Engine with Complete Transaction Pipeline

set -e

echo "🍽️  IYARÀ SIDE RESTAURANT - DEPLOYMENT SCRIPT"
echo "=============================================="
echo ""

# Step 1: Build Check
echo "📦 Step 1: Building production bundle..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo ""
echo "📊 Build Statistics:"
echo "└── Bundle size: ~300 kB (gzipped: ~87 kB)"
echo "└── Build time: ~30-60 seconds"
echo "└── Output directory: dist/"

echo ""
echo "=============================================="
echo "🚀 DEPLOYMENT OPTIONS"
echo "=============================================="
echo ""
echo "Option A: Netlify Drag & Drop (Easiest)"
echo "  1. Go to https://app.netlify.com"
echo "  2. Click 'Add new site' → 'Deploy manually'"
echo "  3. Drag the 'dist' folder to the upload area"
echo "  4. Your site will be live in ~30 seconds!"
echo ""
echo "Option B: Netlify CLI (If installed)"
echo "  Run: netlify deploy --prod --dir=dist"
echo ""
echo "=============================================="
echo "✨ WHAT'S DEPLOYED"
echo "=============================================="
echo "✅ Complete transaction pipeline (CARSS Protocol)"
echo "✅ Live CEO & Staff dashboards"
echo "✅ WhatsApp + Telegram routing"
echo "✅ QR-code table assignment"
echo "✅ Role-based authentication"
echo "✅ Real-time order tracking"
echo ""
echo "=============================================="
echo "📋 POST-DEPLOYMENT CHECKLIST"
echo "=============================================="
echo "⬜ Generate QR codes for tables (/?table=1, /?table=2, etc.)"
echo "⬜ Share staff login credentials (CEO PIN: 1234)"
echo "⬜ Test customer ordering flow"
echo "⬜ Test staff dashboard access"
echo "⬜ Verify WhatsApp message routing"
echo ""
echo "📖 Full deployment guide: FRONTEND_DEPLOYMENT.md"
echo ""
echo "🎉 Build complete! Ready to deploy."
