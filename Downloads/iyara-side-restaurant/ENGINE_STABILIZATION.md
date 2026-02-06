# Iyará Side Static Engine - Stabilization & Generalization Specs

## 1. Stabilization Checklist
Status of the current `static_site` engine against multi-venue requirements.

| Feature | Current Status | Required Action |
| :--- | :--- | :--- |
| **Config Centralization** | ⚠️ Partial | `script.js` has config, but `index.html` has hardcoded bank details. Move visual data to dynamic injection. |
| **Table Context** | ✅ Good | URL params + Session persistence working. |
| **Payment: POS/Cash** | ✅ Good | Simple, robust flows. |
| **Payment: Transfer** | ⚠️ Basic | No verification metadata (Who sent it?). Hardcoded bank display. |
| **WhatsApp Receipt** | ⚠️ Readable | Easy to spoof. Needs an integrity checksum. |
| **Anti-Abuse** | ❌ Missing | No stale checks. No input validation for transfer claims. |
| **Deployment** | ⚠️ Raw | No cache headers. Vulnerable to stale client caches. |

## 2. Config Standard
The `CARSS_CONFIG` object is the single source of truth. Future venues (DeFacto Lounge, etc.) only edit this object.

### Standard Object Structure
```javascript
const CARSS_CONFIG = {
    venue: {
        name: "Iyarà Side Restaurant",
        theme: "iyara-dark", // Helper for CSS variables if needed
        logo_url: "assets/logo.png"
    },
    whatsapp: {
        phone: "2349014596269", // No "+" prefix, digits only
        base_url: "https://wa.me/"
    },
    bank: {
        bankName: "Access Bank",
        accountNumber: "0123456789",
        accountName: "Iyarà Side Restaurant",
        transferNote: "Use Order ID as ref"
    },
    features: {
        lounge_mode: false, // Toggles service pipelines
        require_transfer_metadata: true, // Forces user to input sender name
        table_reconfirm_ms: 60 * 60 * 1000 // 1 hour (Ask "Still here?" after 1h)
    },
    table_ttl_ms: 6 * 60 * 60 * 1000 // 6 hours (Hard expiry)
};
```

### Implementation Rule
**NO HARDCODED VALUES IN HTML.**
On `init()`, a new function `hydrateAppsConfig()` must run:
- Find elements with `data-config="bank.accountNumber"`
- Replace `innerText` with `CARSS_CONFIG.bank.accountNumber`
- This ensures changing the JS config instantly updates the UI.

## 3. Hardening Plan (Anti-Abuse)

### A. Immutable Order Signature
Prevent users from editing the WhatsApp message to lower prices.
- **Logic**: Generate a short hash (e.g., FNV-1a or simple DJB2) of `OrderId + TotalAmount`.
- **Display**: Append `🔐 [SIG: A1B2C3]` to the WhatsApp text.
- **Verification**: Staff can visually check if the signature looks "complex" (Security Theater) or use a simple staff tool to verify key orders.

### B. Mandatory Transfer Metadata
Prevent ambiguous transfers where staff see credit but don't know who sent it.
- **Change**: In the Transfer Modal, BEFORE showing "Send WhatsApp":
  - Show input: "Sender Name" (Required)
  - Show input: "Amount Sent" (Pre-filled, editable)
- **Payload**: Add `👤 Sender: [User Input]` to WhatsApp message.
- **Status**: Mark payment as `⏳ UNVERIFIED` in the text until staff confirm receipt.

### C. Stale Table Reconfirmation
Prevent users from accidentally ordering to yesterday's table.
- **Logic**: If `sessionTable` exists AND `Date.now() - sessionTimestamp > table_reconfirm_ms`:
  - Show Modal: "Are you still at Table 5?"
  - Options: "Yes, Confirm" (Update TS) / "No, Switch" (Clear & Welcome Modal).

## 4. Lounge-Mode Extension Spec
Extend the engine for "DeFacto Lounge" without forks.

### Feature Flag: `lounge_mode: true`
Enabled via `CARSS_CONFIG.features.lounge_mode`.

### 1. Department Routing
Lounge orders often go to different bars (Kitchen vs Pool Bar vs Main Bar).
- **Data Update**: Add `department: "bar" | "kitchen"` to `ALL_DISHES`.
- **Routing**:
  - Split WhatsApp message into sections:
    - **🏛️ KITCHEN TICKET**
    - **🍹 BAR TICKET**
  - Or support multiple whatsapp numbers (advanced). For now, single number with clear sections.

### 2. Service Pipeline
Lounges need to track "Served" vs "Open".
- **Concept**: Since we have no backend, we rely on the **WhatsApp Thread** as the state.
- **Action**: The WhatsApp message explicitly includes a "Staff Checklist":
  - `[ ] Payment Confirmed`
  - `[ ] Order Punched`
  - `[ ] Served`
- Staff copies/quotes the message back to the group when steps are done.

### 3. Staff Guard
- Hidden UI (Triple tap header?) -> Enter PIN -> Show "Ops Dashboard" (just config dump or cache clear).

## 5. Netlify Deployment Hardening
Create a `_headers` file in `static_site/` to control caching.

```text
# Cache assets aggressively
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Do NOT cache index.html (ensure config updates propagate)
/index.html
  Cache-Control: public, max-age=0, must-revalidate

# Security Headers
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
```

## 6. Playbook: Cloning for DeFacto Lounge
1.  **Copy Folder**: `cp -r static_site/ defacto_lounge/`
2.  **Edit Config**: Open `script.js` -> `CARSS_CONFIG`.
    - Change Name to "DeFacto Lounge"
    - Change Colors (in `tailwind.config` script block in `index.html`)
    - Change WhatsApp & Bank
    - Set `lounge_mode: true`
3.  **Swap Data**: Replace `data.js` with lounge menu.
4.  **Deploy**: Drag `defacto_lounge/` to Netlify.

**Zero Logic Changes Required.**
