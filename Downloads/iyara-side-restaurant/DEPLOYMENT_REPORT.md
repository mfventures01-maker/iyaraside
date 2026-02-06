# Iyarà Side Restaurant - Deployment Status Report

## 1. Project Status Overview
**Current State**: Functional Prototype / Pre-Alpha
**Build Status**: ✅ Passing (`npm run build` successful)
**Tech Stack**: Vite + React + TypeScript, Supabase (Backend), Google Gemini (AI).

### Key Features Implemented
- **QR-Centric Ordering**: 
  - URL parameter detection (`?table=5`) for automatic table assignment.
  - Manual table entry fallback for walk-ins.
  - Integration with `CartContext` for order management.
- **Digital Menu**:
  - Fully integrated into the Homepage below the hero section.
  - "Call Waiter" functionality via WhatsApp.
- **Iyarà Intelligence (AI)**:
  - Menu recommendation engine powered by Google Gemini (Flash model).
  - Wired into the frontend with a "Maître d'" persona.
- **Luxury/VIP Layer**:
  - Data models defined for `ClientDossier`, `PrivacyScore`, and `SocialGeometry`.
  - `EliteDashboard` component exists for staff/management view.
- **Database**:
  - SQL Migrations ready (`luxury_init.sql`).

---

## 2. Challenges to Deployment

### 🔴 Critical: Security
- **API Key Exposure**: The `GEMINI_API_KEY` is currently injected into the client-side bundle via `vite.config.ts`.
  - *Risk*: Malicious users can extract this key and consume your API quota.
  - *Location*: `vite.config.ts` line 14-15 defines `process.env.API_KEY`.

### 🟠 High: Performance for Target Market
- **Bundle Size**: The build transforms ~1700 modules. Without aggressive code-splitting, the initial load may be slow on mobile networks (3G/4G).
- **Asset Weight**: The Homepage uses high-resolution Unsplash images (e.g., `Home.tsx` line 55). These need to be optimized or they will drain user data and slow down LCP (Largest Contentful Paint).

### 🟡 Medium: Infrastructure
- **Environment Variables**: Adoption depends on `.env.local`. Deployment environments (Vercel/Netlify) must be manually configured with:
  - `GEMINI_API_KEY`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Database Sync**: The `luxury_init` migration must be applied to the production Supabase instance, or the "Elite Dashboard" will crash.

---

## 3. Solutions & Implementation Plan

### Phase 1: Security Hardening (Highest Priority)
1. **Move AI to Backend**:
   - Create a Supabase Edge Function (`functions/ask-concierge`).
   - Move the Gemini implementation from `geminiService.ts` to this function.
   - Client calls the Edge Function instead of the Gemini API directly.
   - **Result**: API Key remains server-side and secure.

### Phase 2: Performance Optimization
1. **Image Optimization**:
   - Replace raw Unsplash URLs with a responsive image component or optimized assets in `public/`.
   - Implement "blur-up" placeholders for the Hero background.
2. **Lazy Loading**:
   - Lazily load the `EliteDashboard` and `DigitalMenu` (if not immediately visible) using `React.lazy()`.

### Phase 3: Reliability
1. **Offline Grace**:
   - Add error handling for the AI service (e.g., if network fails, show a static "Chef's Special" list).
2. **Migration Script**:
   - Create a `db:push` script or workflow to ensure Supabase migrations are always in sync with the frontend deploy.
