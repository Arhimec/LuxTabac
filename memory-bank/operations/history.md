---
version: 1.1.0
environment: prod
deployed: 2026-10-21T19:26:00Z
deployed_by: operations-agent
status: success
---

# Deployment History

## Deployment: v1.0.0 → Development (Local Preview)

### Details
- **Version**: `v1.0.0`
- **Environment**: Development (`http://localhost:3000`)
- **Timestamp**: `2026-10-19T22:01:45Z`
- **Status**: ✅ Verified (HTTP 200 on `/` and `/api/orders`)
- **Database**: SQLite `./data/luxtabac.db` (WAL mode enabled)

### Rollback Command
```text
git checkout HEAD~1
```

---

## Deployment: v1.0.0 → Staging (Vercel Preview)

### Details
- **Version**: `v1.0.0`
- **Environment**: Staging (`vercel-preview`)
- **Timestamp**: `2026-10-19T22:03:10Z`
- **Status**: ✅ Deployed & Verified
- **Runtime Target**: Vercel Serverless Function (`/tmp/luxtabac.db`)
- **Route Rewrites**: `/api/orders` $\rightarrow$ `api/orders.js`, `/` $\rightarrow$ `index.html`

### Rollback Command
```text
vercel rollback preview
```

---

## Deployment: v1.0.0 → Production (Vercel Production)

### Details
- **Version**: `v1.0.0`
- **Environment**: Production (`vercel-production`)
- **Timestamp**: `2026-10-19T22:04:00Z`
- **Status**: ✅ Active & Healthy
- **Target Platform**: Vercel Serverless Functions + Global Edge CDN
- **Database Engine**: SQLite with WAL journaling (`/tmp/luxtabac.db`)

### Rollback Command
```text
vercel rollback prod
```

---

## Deployment: v1.0.1 → Production (Vercel Production)

### Details
- **Version**: `v1.0.1`
- **Environment**: Production (`vercel-production`)
- **Timestamp**: `2026-10-19T22:31:00Z`
- **Commit**: `0600dbf` (*fix(ui): resolve age verification modal dismissal and qrcode CDN script loading*)
- **Status**: ✅ Deployment Completed & Active
- **Build Output**: Built in 609ms, outputs deployed to Vercel edge/serverless platform
- **Changes**:
  - Fixed `#age-modal` CSS specificity (`#age-modal.hidden { display: none !important; }`), ensuring modal is dismissed when clicking 18+ confirmation.
  - Added defensive inline `onclick` handler on confirm button.
  - Replaced relative `qrcode.min.js` with jsDelivr CDN (`https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js`), resolving `SyntaxError: Unexpected token '<'`.
  - Added safe `sessionStorage` helpers for private/restricted browsing modes.
  - Corrected DOM element IDs in 1-Click Rebuy.
- **Automated Tests**: 15 / 15 tests passing.

---

## Deployment: v1.0.2 → Production (Vercel Production)

### Details
- **Version**: `v1.0.2`
- **Environment**: Production (`vercel-production`)
- **Timestamp**: `2026-10-19T22:41:00Z`
- **Commit**: `95ba1b7` (*fix(ui): close price-explorer-modal div preventing page content from being hidden*)
- **Status**: ✅ Deployment Verified & Active
- **Root Cause & Fix**:
  - `#price-explorer-modal` had an unclosed outer `<div>` tag right above the history drawer and header.
  - Because `#price-explorer-modal` is initialized with `class="hidden"`, the browser DOM parser treated the entire page (`<header>`, `<main>`, Order Builder form) as children of the hidden price modal.
  - When the user clicked age verification, `#age-modal` closed, but the entire page was invisible (black screen) because it was trapped inside `#price-explorer-modal.hidden`.
  - Added the missing closing `</div>`, completely restoring normal DOM layout.
- **Verification**: Verified via Playwright / Browser Agent screenshot showing full active catalog and order form.
- **Automated Tests**: 15 / 15 tests passing.

---

## Deployment: v1.1.0 → Production (Vercel Production via GitHub Push)

### Details
- **Version**: `v1.1.0`
- **Environment**: Production (`vercel-production`)
- **Timestamp**: `2026-10-21T19:26:00Z`
- **Commit**: `937df9d` (*feat(bolt-008): wero qr payment integration and admin settings*)
- **Status**: ✅ Deployed & Healthy
- **Scope & Releases**:
  - **Bolt 005**: Single 5€ round up tip, 5% floor rounding, full cigarette catalog without chopped tobacco, and buyer name reorder pre-filtering.
  - **Bolt 006**: Weekly quota governance enforcing maximum 800 cigarettes per calendar week, automatic Monday 00:00 UTC quota reset, quota meter, and modal limit warnings.
  - **Bolt 007**: Protected admin portal (`/api/admin`), centralized app settings management (Revtag, WhatsApp recipient, Coffee promo visibility toggle), custom brand submissions with admin price adjustments.
  - **Bolt 008**: European instant account-to-account wallet **Wero** payment method, dual-tab switcher in Step 2 (`#tab-pay-revolut` / `#tab-pay-wero`), dynamic Wero QR code generation, direct action deep-linking, recipient badge pill, and manifest/receipt sync.
- **Automated Tests**: 45 / 45 tests passing.
- **Verification**: Verified via Playwright / Browser Agent automated tests and screenshots.





