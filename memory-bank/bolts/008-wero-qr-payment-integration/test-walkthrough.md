# Test Walkthrough - Bolt 008: Wero QR Payment Integration

## Test Execution Summary

A dedicated automated test suite (`tests/bolt-008.test.js`) was created and executed alongside the full regression suite using Node's native test runner (`node --test`).

**Result**: 45 passed, 0 failed, 0 skipped.

```bash
> luxtabac-reserve@1.0.0 test
> node --test

▶ SQLite Database Module Tests
  ✔ database path and schema initialization (0.83ms)
  ✔ insertOrder and getRecentOrders (0.55ms)
✔ SQLite Database Module Tests (2.01ms)
▶ Serverless /api/orders Handler Tests
  ✔ OPTIONS preflight request (0.51ms)
  ✔ GET /api/orders returns orders array (0.93ms)
  ✔ POST /api/orders successfully creates order (3.78ms)
  ✔ POST /api/orders rejects invalid payload without items (0.26ms)
  ✔ PUT /api/orders returns 405 Method Not Allowed (0.20ms)
✔ Serverless /api/orders Handler Tests (7.92ms)
▶ Bolt 005: Tip & Catalog Streamline Tests (3.48ms)
▶ Bolt 006: Weekly Quota Governance Tests (11.48ms)
▶ Bolt 007: Admin Portal, Settings & Back-Office Suite (9.28ms)
▶ Bolt 008: Wero QR Payment Integration Suite
  ✔ Story 001: Wero recipient default setting and DB persistence (1.65ms)
  ✔ Story 001: /api/settings GET and authenticated PUT handles weroRecipient (1.13ms)
  ✔ Story 002: index.html contains payment method tabs and Wero elements (1.00ms)
  ✔ Story 003: Database orders schema supports payment_method column (0.30ms)
  ✔ Story 003: /api/orders POST handles paymentMethod and defaults to revolut (2.35ms)
  ✔ Story 003: Wero payload format logic satisfies URL and URI scheme standards (0.08ms)
✔ Bolt 008: Wero QR Payment Integration Suite (10.28ms)
▶ Checkout Refinement & Promotions Tests (Intent 002) (3.07ms)
▶ Order History UI & Integration Tests (2.68ms)
ℹ tests 45
ℹ suites 1
ℹ pass 45
ℹ fail 0
```

## Detailed Test Coverage

### Story 001: Admin Wero Settings Maintenance
1. **Default & DB Persistence**:
   - Verified `app_settings` returns `weroRecipient: '+352 691 000 000'` upon initial boot.
   - Verified `updateSettings({ weroRecipient: '+352 691 999 888' })` persists changes to disk and reflects immediately in subsequent reads.
2. **REST API Security & Data Handling**:
   - `GET /api/settings`: Returns `weroRecipient` with HTTP 200.
   - `PUT /api/settings`: Rejects unauthenticated requests with HTTP 401 Unauthorized.
   - Authenticated `PUT /api/settings`: Successfully updates `weroRecipient` with Bearer token authentication.

### Story 002: Dual Payment Method Selector Tabs & DOM Structure
1. **DOM Elements Verification**:
   - Verified `#tab-pay-revolut` and `#tab-pay-wero` exist in `index.html`.
   - Verified `#admin-setting-wero` input exists in `#admin-panel-settings`.
   - Verified `#pay-method-icon`, `#pay-method-title`, `#pay-method-subtitle`, `#qr-recipient-pill`, `#qr-center-badge`, `#qr-scan-instruction`, `#btn-copy-pay-details`, and `#btn-open-pay-direct` are present.
   - Verified header Step 2 badge is updated to `2. Payment`.

### Story 003: Wero QR Code Generation, Payload & Persistence
1. **Order Persistence & Schema**:
   - Verified `orders` SQLite table contains `payment_method` column.
   - Verified `insertOrder` with `paymentMethod: 'wero'` persists and is retrieved accurately by `getOrderByCode`.
   - Verified `POST /api/orders` accepts `paymentMethod: 'wero'` and defaults to `'revolut'` when omitted.
2. **QR Payload Format Validation**:
   - Verified standard Wero custom URI scheme generation: `wero://pay?recipient=${recipient}&amount=${amount}&currency=EUR&ref=${ref}`.
   - Verified fallback web URL format when recipient is configured as an HTTPS pay link.
   - Verified `qrcode-generator` creates valid SVG QR matrices with Level `Q` error correction.
