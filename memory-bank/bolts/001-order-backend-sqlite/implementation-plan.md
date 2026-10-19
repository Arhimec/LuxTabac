---
stage: plan
bolt: 001-order-backend-sqlite
created: 2026-10-19T21:30:50Z
---

## Implementation Plan: 001-order-backend-sqlite

### Objective
Scaffold the fullstack foundation for LuxTabac on Vercel, including package configuration, Vercel routing, local SQLite database initialization with table schema, and serverless API endpoints (`/api/orders`) for order insertion and retrieval.

### Deliverables
1. **`package.json`**:
   - Project metadata, Node.js `>=18` runtime specification.
   - Production dependencies for SQLite operations and development scripts.
2. **`vercel.json`**:
   - Route rewrites directing `/api/(.*)` to serverless functions in the `/api` directory.
   - Clean URLs and headers for static file serving.
3. **`api/_db.js` (SQLite Connection & Migration Helper)**:
   - Dynamic path resolution: uses `/tmp/orders.db` in Vercel serverless environments and `./data/orders.db` during local execution.
   - Auto-migration ensuring the `orders` table exists:
     ```sql
     CREATE TABLE IF NOT EXISTS orders (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       order_code TEXT UNIQUE NOT NULL,
       customer_name TEXT NOT NULL,
       delivery_date TEXT,
       delivery_notes TEXT,
       items_json TEXT NOT NULL,
       grand_total REAL NOT NULL,
       revolut_reference TEXT,
       total_cigs INTEGER DEFAULT 0,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
     );
     CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
     CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);
     ```
   - Prepared statement helpers: `insertOrder(order)` and `getRecentOrders(limit)`.
4. **`api/orders.js` (Vercel Serverless Function Handler)**:
   - `GET /api/orders`: Retrieves recent orders sorted newest-first, parsing `items_json` back to objects.
   - `POST /api/orders`: Validates payload (`orderCode`, `customerName`, `deliveryDate`, `items`, `grandTotal`, `revolutReference`), computes `total_cigs` if not provided, executes prepared insert, and returns 201 Created.
   - Handles unsupported HTTP methods with 405 Method Not Allowed and robust error handling with 400/500 JSON responses.

### Dependencies
- **SQLite Engine**: Node.js SQLite integration with zero external network requirement, supporting serverless `/tmp` file persistence and ACID transactions.

### Technical Approach
- Strict defensive coding: Parameterized SQL queries for 100% SQL injection prevention.
- Environment awareness: Check `process.env.VERCEL` to determine the database file path (`/tmp` vs local workspace directory).
- Fast cold-start performance: Cached singleton database connection across lambda warm invocations.

### Acceptance Criteria
- [ ] `package.json` and `vercel.json` configured and verified
- [ ] Database automatically boots up and initializes `orders` schema without manual SQL setup
- [ ] `POST /api/orders` successfully inserts order record with validated fields
- [ ] `GET /api/orders` retrieves orders ordered newest first
- [ ] Errors return clear JSON responses with appropriate HTTP status codes
