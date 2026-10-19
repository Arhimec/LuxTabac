---
stage: implement
bolt: 001-order-backend-sqlite
created: 2026-10-19T21:35:20Z
---

## Implementation Walkthrough: 001-order-backend-sqlite

### Summary

Engineered the complete serverless backend persistence layer for LuxTabac using Node.js and a local SQLite database. Implemented dynamic environment path resolution for Vercel, parameterized query handlers, and full REST endpoints for order persistence and history retrieval.

### Structure Overview

The architecture introduces a clean serverless API pattern under `/api` alongside local development tooling. A dedicated database module manages SQLite connections, schema initialization, and prepared queries. The orders endpoint handles HTTP routing, request validation, and CORS headers.

### Completed Work

- [x] `package.json` - Node `>=22` runtime configuration, metadata, and scripts for start, dev, and test
- [x] `vercel.json` - Vercel deployment routes and rewrites for serverless `/api` endpoints and static assets
- [x] `api/_db.js` - SQLite singleton connection manager, auto-migration for `orders` schema, and prepared statement query helpers
- [x] `api/orders.js` - Vercel serverless HTTP handler implementing `GET` and `POST` methods with CORS and status codes
- [x] `server.js` - Local development HTTP server serving static frontend files and dispatching `/api/orders` requests

### Key Decisions

- **Node.js Native SQLite (`node:sqlite`)**: Chosen for zero external build dependencies, eliminating `node-gyp` native compilation issues during Vercel serverless deployments.
- **Dynamic File Path (`/tmp/` vs `./data/`)**: Configured automatic detection of Vercel serverless lambda environments where `/tmp` is the only writable directory, while persisting to `./data/` during local development.
- **Parameterized SQL**: Enforced parameterized statements for all database operations to eliminate SQL injection vulnerabilities.

### Deviations from Plan

None.

### Dependencies Added

- [x] `node:sqlite` (Node.js built-in runtime module) - Native ACID SQLite engine without third-party npm package overhead

### Developer Notes

In local development, the SQLite database is automatically created at `./data/luxtabac.db`. Run `npm start` to test the fullstack server locally.
