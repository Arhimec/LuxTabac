# Implementation Walkthrough: 003-checkout-streamline

## Key Changes

### 1. Delivery Date and Delivery Note Removal
- **UI (`index.html`)**: Removed `#delivery-date`, `#delivery-notes`, and `#summary-delivery-date`/`#summary-delivery-notes` DOM nodes. Refactored the customer name input into a clean full-width input.
- **Backend & SQLite (`api/_db.js`, `api/orders.js`)**: Updated `orders` table to allow null/empty delivery fields. Updated order insertion logic to handle empty string / null values gracefully.

### 2. Home Navigation
- Added `#btn-header-home` in the header bar and wrapped the brand title/logo in `#header-brand-link`.
- Implemented `handleNavigateHome()`:
  - Closes history drawer and all open modals.
  - Transitions back to Step 1 order view if currently on Step 2.
  - Clears customer name, basket, and resets tip to `none`.
  - Scrolls smoothly to top.
  - **Crucially retains** `sessionStorage.getItem('luxtabac_age_verified')` so the customer is never prompted again for age verification in the same session.

### 3. Interactive Tipping System
- Added `#tip-chips-container` with 4 interactive toggle chips:
  - `none`: €0.00
  - `round-5`: rounds up to next multiple of 5 EUR (or adds 5.00 EUR if already exact)
  - `round-10`: rounds up to next multiple of 10 EUR (or adds 10.00 EUR if already exact)
  - `percent-5`: calculates 5% of cart subtotal rounded to 2 decimals
- Updated real-time UI calculation to reflect tip amount in:
  - Step 1 Tip display badge (`#tip-amount-display`)
  - Step 1 Submit CTA button text
  - Step 2 Summary Tip row (`#summary-tip-row`, `#summary-tip`)
  - Revolut P2P payment URL and QR Code generation
  - WhatsApp order manifest text and digital receipt slip
- Stored `tip_amount` in SQLite database with schema migration.
