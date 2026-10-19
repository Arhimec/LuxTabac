---
id: 003-vercel-deployment-config
unit: 001-order-backend-sqlite
intent: 001-order-persistence-and-history
priority: Must
status: complete
created: '2026-10-19T21:24:20Z'
implemented: true
---

# Story: Vercel Deployment Configuration

## As a
DevOps Engineer

## I want
Configuration files (`vercel.json`, `package.json`) specifying routes, builds, and dependencies

## So that
LuxTabac deploys to Vercel with zero runtime configuration errors.

## Acceptance Criteria
- [ ] `package.json` specifies Node.js engine, dependencies (e.g. `better-sqlite3` or SQLite driver), and scripts (`dev`, `start`)
- [ ] `vercel.json` configures routes: static assets serve root files, `/api/*` routes to serverless functions
- [ ] Verified build runs cleanly without missing dependencies
