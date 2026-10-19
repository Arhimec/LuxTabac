---
id: 001-order-backend-sqlite
unit: 001-order-backend-sqlite
intent: 001-order-persistence-and-history
type: simple-construction-bolt
status: complete
stories:
  - 001-sqlite-schema-and-connection
  - 002-orders-api-endpoint
  - 003-vercel-deployment-config
created: '2026-10-19T21:25:10Z'
started: '2026-10-19T21:30:30Z'
completed: '2026-10-19T19:39:52Z'
current_stage: null
stages_completed:
  - name: plan
    completed: '2026-10-19T21:31:50Z'
    artifact: implementation-plan.md
  - name: implement
    completed: '2026-10-19T21:35:35Z'
    artifact: implementation-walkthrough.md
requires_bolts: []
enables_bolts:
  - 002-order-history-ui
requires_units: []
blocks: false
complexity:
  avg_complexity: 1
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 001-order-backend-sqlite

## Overview

Backend persistence layer for LuxTabac using a local SQLite database served via Node.js serverless functions on Vercel.

## Objective

Establish the SQLite database connection, table schema, `/api/orders` endpoint for inserting and listing orders, and Vercel configuration files (`vercel.json`, `package.json`).

## Stories Included

- **001-sqlite-schema-and-connection**: SQLite connection helper and schema migration (Must)
- **002-orders-api-endpoint**: Serverless API route `/api/orders` (GET/POST) (Must)
- **003-vercel-deployment-config**: Vercel deployment configuration (`vercel.json`, `package.json`) (Must)

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → api/orders.js, api/_db.js, vercel.json, package.json + implementation-walkthrough.md
- [ ] **3. Test**: Pending → test-walkthrough.md

## Dependencies

### Requires
- None (foundational backend layer)

### Enables
- 002-order-history-ui (frontend connects to `/api/orders`)

## Success Criteria

- [ ] All 3 backend stories implemented
- [ ] Local SQLite database creates and connects cleanly
- [ ] `POST /api/orders` validates payload and inserts order
- [ ] `GET /api/orders` returns list of orders sorted newest-first
- [ ] `vercel.json` and `package.json` are valid and ready for deployment
