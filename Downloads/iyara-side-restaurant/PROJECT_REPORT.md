# Iyarà Side Restaurant - Static Site Release & Stabilization Report

## 🚀 Executive Summary
The `static_site/` folder is now a **Hardened, Generalized Static Engine**.
It is production-ready for Iyarà Side and easily cloneable for other venues (e.g., DeFacto Lounge).

- **Status**: Production Ready ✅
- **Engine Version**: v2.0 (Stabilized)
- **Framework**: Vanilla JS (No build step)

## 🛡️ Stabilization & Hardening Features (v2.0)
We introduced "Operational Hardening" to prevent abuse without a backend:
1.  **Immutable Order Signature**: Every WhatsApp receipt includes `🔐 [SIG: XXXXXX]` to prevent price editing.
2.  **Mandatory Transfer Metadata**: Users *must* enter "Sender Name" and "Amount" for transfers. WhatsApp payload includes `👤 Sender: ...`.
3.  **Config hydration**: `CARSS_CONFIG` in `script.js` is the Single Source of Truth. HTML updates automatically.
4.  **Stale Table Reconfirmation**: If a session is >1hr old, the system asks "Are you still at Table X?" before allowing orders.

## 📦 Deployment Instructions (Netlify)
1.  **Log in to Netlify**.
2.  **Add New Site** -> **Deploy Manually**.
3.  **Drag and drop** the `static_site` folder.
4.  **Caching Rules**: A `_headers` file is included to ensure `index.html` is never cached (instant config updates) while assets are cached for 1 year.

## ⚙️ Configuration Guide (`script.js`)
Edit `CARSS_CONFIG` to change venue details. **No HTML editing required.**

```javascript
const CARSS_CONFIG = {
    venue: {
        name: "Iyarà Side Restaurant",
        theme: "iyara-dark",
        logo_url: "assets/logo.png"
    },
    whatsapp: {
        phone: "2349014596269", 
        base_url: "https://wa.me/"
    },
    bank: {
        bankName: "Access Bank",
        accountNumber: "0123456789",
        transferNote: "Use Order ID as ref"
    },
    features: {
        lounge_mode: false,         // Future: enable service pipelines
        require_transfer_metadata: true, 
        table_reconfirm_ms: 3600000 // 1 hour
    }
};
```

## 👯 How to Clone for "DeFacto Lounge"
1.  **Copy Folder**: Duplicate `static_site/` -> `defacto_lounge/`.
2.  **Update Config**: Open `defacto_lounge/script.js`:
    - Change `venue.name` to "DeFacto Lounge".
    - Change `whatsapp.phone` to the lounge manager's number.
    - Change `bank.accountNumber` to the lounge account.
3.  **Swap Data**: Replace `data.js` with the lounge's menu items.
4.  **Deploy**: Drag `defacto_lounge/` to Netlify.

## 🧪 Verification Results
- **Anti-Abuse**: Verified `[SIG]` generation and blocked empty transfer metadata.
- **Hydration**: Verified changing `CARSS_CONFIG` updates the UI immediately.
- **Context**: Verified Table persistency and Stale Prompt checks.
