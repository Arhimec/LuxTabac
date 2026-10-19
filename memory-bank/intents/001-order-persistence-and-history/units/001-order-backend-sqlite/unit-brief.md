---
unit: 001-order-backend-sqlite
intent: 001-order-persistence-and-history
phase: construction
status: complete
created: 2026-10-19T21:23:40Z
updated: 2026-10-19T21:40:00Z
---

# Unit Brief: 001-order-backend-sqlite

## Purpose
Provide a local SQLite database storage layer and Node.js serverless API routes on Vercel for recording and querying customer orders.

## Scope
- SQLite database connection helper (`lib/db.js` or `api/_db.js`) supporting Vercel `/tmp` writable location and local dev storage.
- Database schema initialization (`orders` table).
- Serverless API endpoint `api/orders.js`:
  - `POST /api/orders`: Insert new order with parameterized SQL.
  - `GET /api/orders`: Retrieve recent orders.
- Vercel configuration (`vercel.json`) and `package.json` with dependency setup.

## Key Entities
- `Order`:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `order_code`: TEXT UNIQUE (e.g. `LU-20261019-XXXX`)
  - `customer_name`: TEXT
  - `delivery_date`: TEXT
  - `delivery_notes`: TEXT
  - `items_json`: TEXT (JSON array of items)
  - `grand_total`: REAL
  - `revolut_reference`: TEXT
  - `total_cigs`: INTEGER
  - `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

## Success Criteria
- [ ] Database automatically initializes table on first run
- [ ] Prepared statements prevent SQL injection
- [ ] `POST /api/orders` persists orders and returns 201 Created
- [ ] `GET /api/orders` returns array of orders sorted by `created_at DESC`
- [ ] Vercel deployment config (`vercel.json`) validates correctly
