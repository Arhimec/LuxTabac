---
version: 1.1.0
commit: 937df9d
built: 2026-10-21T19:25:31Z
status: success
---

# Build: v1.1.0

## Artifact
- **Type**: Vercel Serverless Fullstack Package
- **Tag**: `luxtabac-reserve:v1.1.0`
- **Target Platform**: Vercel (Edge & Serverless Node.js 22.x)
- **Database Engine**: Built-in SQLite (`node:sqlite`) with WAL journaling
- **Features Included**:
  - Bolt 005: Tip (5€ round up + integer-rounded 5%) & manufactured cigarette catalog expansion
  - Bolt 006: Weekly 800-cig quota enforcement (resetting Monday 00:00) with capacity meter
  - Bolt 007: Admin portal, settings management (Revtag, WhatsApp, Coffee visibility), and custom items
  - Bolt 008: Wero QR payment integration & admin recipient settings

## Packaged Artifacts
1. `index.html` - Single-page web application with dual Revolut/Wero payment selector tabs, quota meter, admin modal, coffee showcase, and receipt generator
2. `qrcode.min.js` - Offline ISO/IEC 18004 QR generation engine
3. `api/_db.js` - SQLite connection manager with WAL mode, auto-migrations, settings, quota aggregation, and orders persistence
4. `api/orders.js` - Serverless API routes for `/api/orders`
5. `api/quota.js` - Serverless API route for `/api/quota`
6. `api/admin.js` - Admin authentication and session verification routes
7. `api/settings.js` - Public GET and authenticated PUT for global app settings
8. `api/coffee-promos.js` - Admin CRUD for promotional coffee items
9. `api/custom-items.js` - Custom cigarette brand entries and price adjustments
10. `server.js` - Local dev server for previewing and testing
11. `vercel.json` - Complete Vercel route rewrites
12. `package.json` - Node dependencies, scripts, and Node >= 22 engine config

## Test Verification Summary
- **Tests**: 45 / 45 passed (100%)
- **Test Suites**: 6 suites
- **Test Duration**: ~360ms
- **Status**: Ready for production deployment via GitHub / Vercel integration

