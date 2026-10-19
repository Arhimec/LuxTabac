---
id: 002-orders-api-endpoint
unit: 001-order-backend-sqlite
intent: 001-order-persistence-and-history
priority: Must
status: complete
created: '2026-10-19T21:24:10Z'
implemented: true
---

# Story: Orders Serverless API Endpoint

## As a
Frontend Client

## I want
A serverless endpoint (`api/orders.js`) accepting GET and POST requests

## So that
New orders are persisted to SQLite and historical orders can be retrieved by the user.

## Acceptance Criteria
- [ ] `POST /api/orders`:
  - Validates required fields (`orderCode`, `customerName`, `deliveryDate`, `items`, `grandTotal`, `revolutReference`)
  - Serializes item breakdown to JSON
  - Inserts into SQLite using prepared statement
  - Returns 201 Created with saved order payload
- [ ] `GET /api/orders`:
  - Queries orders from SQLite sorted by `created_at DESC`
  - Parses `items_json` back to array
  - Returns 200 OK with orders list
- [ ] Returns structured error JSON (`{ error: string }`) with appropriate HTTP status codes (400, 405, 500)
- [ ] Sets appropriate CORS and Cache-Control headers
