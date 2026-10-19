---
version: 1.0.0
commit: local-head
built: 2026-10-19T22:01:00Z
status: success
---

# Build: v1.0.0

## Artifact
- **Type**: Vercel Serverless Fullstack Package
- **Tag**: `luxtabac-reserve:v1.0.0`
- **Target Platform**: Vercel (Edge & Serverless Node.js 22.x)
- **Database Engine**: Built-in SQLite (`node:sqlite`) with WAL journaling

## Build Environment
- **OS**: macOS (Darwin 24.x)
- **Node Runtime**: Node.js v25.8.2 / Vercel Node 22.x
- **Build Tool**: npm / Node test runner

## Packaged Artifacts
1. `index.html` - Complete client single-page application with dark mode UI, order builder, slide-over drawer, and modal views
2. `qrcode.min.js` - Offline ISO/IEC 18004 QR generation engine
3. `api/_db.js` - SQLite connection manager with WAL mode and auto-migration
4. `api/orders.js` - Serverless API routes for `/api/orders`
5. `server.js` - Local dev server for previewing and testing
6. `vercel.json` - Vercel deployment configuration
7. `package.json` - Node dependencies and scripts

## Test Verification Summary
- **Tests**: 14 / 14 passed (100%)
- **Test Duration**: 89ms
- **Status**: Ready for deployment to Dev and Staging
