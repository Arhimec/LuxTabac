---
bolt: 003-checkout-streamline
stage: plan
status: complete
created: 2026-10-19T23:19:15Z
updated: 2026-10-19T23:19:15Z
---

# Implementation Plan: Bolt 003 - Checkout Streamline & Interactive Tips

## Executive Summary

Streamline the customer checkout experience by removing delivery logistics inputs (delivery date, delivery notes), providing instant Home/Reset navigation in the top header without re-triggering age verification, and introducing 4 interactive tip selection chips (`[No tip]`, `[Round to 5€]`, `[Round to 10€]`, `[5%]`) that dynamically update the grand total, Revolut transfer link, Revolut QR code, and receipt slip.

---

## Technical Changes Breakdown

### 1. Delivery Logistics Removal
- **HTML (`index.html`)**:
  - Remove `<div class="space-y-2">` containing `<label for="delivery-date">` and `#delivery-date`.
  - Remove `<div class="space-y-2">` containing `<label for="delivery-notes">` and `#delivery-notes`.
  - Update grid columns from 2-column or unbalanced row to clean full name input.
- **JavaScript (`index.html`)**:
  - Remove `setDefaultDeliveryDate()`.
  - Update `buildOrderPayload()` to omit or send empty `deliveryDate` and `deliveryNotes`.
  - Update `showReceiptSlip()` to only render delivery notes if non-empty.
- **Backend API (`api/orders.js`) & DB (`api/_db.js`)**:
  - Verify `insertOrder()` safely handles missing `deliveryDate` and `deliveryNotes` defaulting to `null` or `""`.

### 2. Home Navigation & Reset
- **HTML (`index.html`)**:
  - Add interactive cursor/button attributes to `#header-brand-link` (logo and title).
  - Add a dedicated "🏠 Home" navigation button in the top navigation header bar.
- **JavaScript (`index.html`)**:
  - Add `handleNavigateHome()`:
    - Close history drawer, price explorer modal, and receipt modal.
    - Switch view back to Step 1 (Order Builder) if in Step 2 (Payment).
    - Reset basket and form inputs to default clean state.
    - Retain `sessionStorage.getItem('luxtabac_age_verified')` (no 18+ modal popup).
    - Scroll smoothly to page top.

### 3. Interactive Tip Selection Chips
- **HTML (`index.html`)**:
  - Insert `<div id="tip-selector-container">` above the basket grand total and checkout button:
    - Title: "Optional Courier Tip" with small heart/appreciation icon.
    - 4 toggle chips:
      - `[No tip]` (data-tip="none", default active)
      - `[Round to 5€]` (data-tip="round-5")
      - `[Round to 10€]` (data-tip="round-10")
      - `[5%]` (data-tip="percent-5")
    - Tip calculation badge displaying `+€X.XX` next to selection.
- **JavaScript (`index.html`)**:
  - State variable `currentTipMode = 'none'` and helper `calculateTip(subtotal, mode)`.
  - Mathematical formulas:
    - `round-5`: `Math.ceil(subtotal / 5) * 5 - subtotal` (if `tip === 0`, `tip = 5`).
    - `round-10`: `Math.ceil(subtotal / 10) * 10 - subtotal` (if `tip === 0`, `tip = 10`).
    - `percent-5`: `Math.round(subtotal * 0.05 * 100) / 100`.
    - `none`: `0`.
  - Real-time DOM reaction:
    - Updates `#basket-grand-total` display.
    - Updates `#payment-grand-total` in Step 2.
    - Updates Revolut QR code and deep link with tip included.
    - Itemizes tip on Receipt Slip.

---

## Validation Strategy
- Run `npm test` verifying backend and UI unit tests pass.
- Add test assertions in `tests/history-drawer-ui.test.js` validating tip calculations, Home navigation element presence, and clean absence of delivery date/notes.
