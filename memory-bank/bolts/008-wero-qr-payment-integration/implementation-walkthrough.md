# Implementation Walkthrough - Bolt 008: Wero QR Payment Integration

## Summary
Bolt 008 completes Unit `001-wero-payment-integration` of Intent `004-wero-qr-payment-method`. It introduces the pan-European account-to-account wallet **Wero** as a premier, official payment method alongside Revolut. Store administrators can configure Wero recipient credentials in the Back-Office console, while buyers can switch seamlessly between Revolut and Wero via high-contrast tabs in Step 2. Dynamic QR codes, direct launch actions, clipboard helpers, receipt slips, and WhatsApp manifests update instantly.

## Key Changes

### 1. Database & Settings Foundation (`api/_db.js`, `api/orders.js`, `api/settings.js`)
- **Settings Persistence**:
  - Added `wero_recipient` key seeded with `+352 691 000 000` in SQLite `app_settings` table.
  - Updated `getAllSettings()` to return `weroRecipient: rowMap.wero_recipient || '+352 691 000 000'`.
  - Updated `updateSettings()` to persist `weroRecipient` when provided.
- **Orders Schema Migration**:
  - Executed `ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'revolut'`.
  - Updated `insertOrder()` to persist `paymentMethod` (defaulting to `'revolut'`).
  - Updated `getRecentOrders()` and `getOrderByCode()` to return `paymentMethod`.
- **API Endpoints**:
  - `GET /api/settings`: Returns `weroRecipient` alongside `revtag`, `whatsappLink`, and `coffeeVisible`.
  - `PUT /api/settings`: Accepts `weroRecipient` with Bearer admin token authorization.
  - `POST /api/orders`: Ingests and stores `paymentMethod: 'revolut'` or `'wero'`.

### 2. Back-Office Management Console (`index.html`)
- Added `#admin-setting-wero` input field inside the **Global Settings** tab of the Back-Office portal.
- Includes descriptive guidance: *"European Payments Initiative Wero recipient identifier (e.g. +352 691 000 000 or Wero link)."*
- Updated `loadAdminData()`, `loadPublicSettings()`, and `handleSaveAdminSettings()` to synchronize Wero configuration with the backend.

### 3. Step 2 Dual-Method Payment View (`index.html`)
- Updated header and stepper badge from `2. Revolut QR` to generic `2. Payment`.
- Implemented high-contrast payment method switch tabs:
  - `#tab-pay-revolut`: Blue theme, Revolut logo, "Revolut".
  - `#tab-pay-wero`: Emerald theme, European flag 🇪🇺, "Wero".
- Dynamic Payment Card (`renderPaymentCard(method)`):
  - **Revolut**: Blue styling, `revolut.me/<revtag>` pill, Revolut QR code, "Open Revolut" CTA, zero-fee SEPA P2P instructions.
  - **Wero**: Emerald green styling, `wero: <weroRecipient>` pill, Wero QR code (supporting `wero://pay?...` and web links), "Pay with Wero" CTA, and European banking app scan instructions (BGL BNP Paribas, Spuerkeess, BIL, ING).
- Real-time recalculation:
  - Switching tabs preserves `activeOrderSummary` (`orderCode`, `name`, `tipAmount`, `finalItems`, `grandTotal`, `revolutReference`) and re-generates the QR code instantly without losing order state.
- Order Manifest & Receipt Slip:
  - `buildOrderManifestText`: Formats payment method line dynamically (`Wero Instant Pay (QR)` vs `Revolut P2P Transfer`) and recipient.
  - `showReceiptSlip`: Displays `PAYMENT: Wero Instant Pay` when `order.paymentMethod === 'wero'`.

## Visual Verification Artifacts
- Admin Wero Settings Configuration: `admin_settings_wero_1792525936582.png`
- Revolut Payment Card in Step 2: `revolut_payment_card_1792528603572.png`
- Verified Stepper and Order Completion: `lux_order_complete_1792528061511.png`
