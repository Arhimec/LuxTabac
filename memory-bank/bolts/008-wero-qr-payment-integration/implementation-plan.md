# Implementation Plan - Bolt 008: Wero QR Payment Integration

## Overview
Implement Wero (European Payments Initiative instant account-to-account wallet) as a first-class payment method alongside Revolut.
Covering backend settings persistence (`api/_db.js`, `api/settings.js`), Back-Office configuration in Global Settings, Step 2 dual-method tabs switcher, dynamic Wero QR code generation, and receipt/manifest sync.

## User Stories
- **001-admin-wero-settings**: Admin configuration of Wero recipient in Back-Office and SQLite `app_settings` via `/api/settings`.
- **002-payment-method-selector-tabs**: Buyer payment method selector tabs in Step 2 with real-time recalculation and dynamic instructions.
- **003-wero-qr-code-generation**: Dynamic Wero QR code generation with amount, order reference, recipient badge, direct launch CTA, and receipt/manifest integration.

---

## Technical Approach

### 1. Database & Settings (`api/_db.js`, `api/settings.js`)
- Ensure `app_settings` table contains `wero_recipient` seeded with default `'+352 691 000 000'`.
- Update `getAllSettings()` to include `weroRecipient: rowMap.wero_recipient || '+352 691 000 000'`.
- Update `updateSettings()` to save `weroRecipient` when provided in update payload.
- Update `api/settings.js` to accept and return `weroRecipient`.

### 2. Back-Office Management Console (`index.html`)
- In `#admin-panel-settings`, add a field:
  - Input `#admin-setting-wero` (e.g. `+352 691 000 000` or custom Wero pay URL / handle).
- Update `loadAdminData()` and `handleSaveAdminSettings()` to load and save `adminSettingWero`.

### 3. Step 2 Dual-Method Payment View (`index.html`)
- Update Step 2 badge in header and main order flow from "2. Revolut QR" to "2. Payment".
- In `#payment-view`, add high-contrast payment method switch tabs:
  - Tab 1: `#tab-pay-revolut` (Revolut logo/pill, active highlight).
  - Tab 2: `#tab-pay-wero` (Wero logo/icon, active highlight).
- State:
  - `let selectedPaymentMethod = 'revolut'; // 'revolut' or 'wero'`
  - `let merchantWero = '+352 691 000 000';`
- On tab switch:
  - Toggles active styling on tabs.
  - Updates recipient pill (`qrRevtagPill` or `qrWeroPill`).
  - Re-generates QR code for selected method:
    - Revolut: `https://revolut.me/<revtag>?amount=<amount>&currency=EUR&note=<ref>`
    - Wero: `wero://pay?recipient=${encodeURIComponent(merchantWero)}&amount=${amount}&ref=${encodeURIComponent(ref)}` (or fallback EPC transfer payload).
  - Updates direct payment CTA:
    - Revolut: `Open Revolut App`
    - Wero: `Pay with Wero App`
  - Updates copy-to-clipboard action to copy relevant payment destination.
- Order Manifest & Receipt:
  - WhatsApp manifest and Receipt slip clearly denote `PAYMENT: Wero Instant Transfer` or `PAYMENT: Revolut P2P`.

### 4. Automated Testing (`tests/bolt-008.test.js`)
- Test `getAllSettings()` and `updateSettings()` for `weroRecipient`.
- Test `GET /api/settings` and `PUT /api/settings` with admin authentication.
- Test Step 2 payment tabs, QR container, and Wero settings elements in `index.html`.
- Verify total test suite passes with 0 failures (`npm test`).

### 5. Browser Verification
- Use `browser_subagent` to verify:
  1. Login to Admin Back-Office, update Wero recipient to `+352 691 123 456`, click Save.
  2. Create an order, advance to Step 2.
  3. Toggle between Revolut and Wero tabs. Verify QR code, recipient pill, and direct link change.
  4. Verify WhatsApp manifest and receipt slip include Wero.
