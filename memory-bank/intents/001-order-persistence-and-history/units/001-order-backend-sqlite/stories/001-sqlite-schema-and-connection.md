---
id: 001-sqlite-schema-and-connection
unit: 001-order-backend-sqlite
intent: 001-order-persistence-and-history
priority: Must
status: complete
created: '2026-10-19T21:24:00Z'
implemented: true
---

# Story: SQLite Schema & Connection Helper

## As a
System Architect

## I want
A database module (`api/_db.js`) that establishes a local SQLite connection and initializes the `orders` table

## So that
The application reliably persists structured order records across Vercel serverless function invocations and local development.

## Acceptance Criteria
- [ ] Resolves database path dynamically (`/tmp/luxtabac.db` on Vercel lambda or `./data/luxtabac.db` locally)
- [ ] Initializes `orders` table if not exists with fields: `id`, `order_code`, `customer_name`, `delivery_date`, `delivery_notes`, `items_json`, `grand_total`, `revolut_reference`, `total_cigs`, and `created_at`
- [ ] Provides prepared statement queries for inserting and fetching orders safely
- [ ] Gracefully handles connection and write errors
