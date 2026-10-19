---
version: 1.0.0
environment: dev
deployed: 2026-10-19T22:01:45Z
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




