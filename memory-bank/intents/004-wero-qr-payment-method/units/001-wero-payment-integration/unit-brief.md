# Unit Brief: 001-wero-payment-integration

## Objective
Deliver full Wero payment capability to LuxTabac Reserve:
1. Store and manage Wero recipient configuration (`wero_recipient`) in SQLite database and Back-Office Global Settings.
2. Provide a luxury dual-tab payment switcher (Revolut vs Wero) on Step 2.
3. Dynamically generate Wero QR codes containing order amount and reference, provide copy and direct payment launch actions, and update order manifests/receipt slips.

## Stories
- `001-admin-wero-settings`: Admin Wero recipient configuration & API persistence.
- `002-payment-method-selector-tabs`: Step 2 payment switcher UI & state coordination.
- `003-wero-qr-code-generation`: Dynamic Wero QR code generation, pay links, and receipt slip sync.

## Target Deliverables
- `api/_db.js`: Extended with `wero_recipient` default and getter/setter.
- `api/settings.js`: Sync `weroRecipient` over public GET and authenticated PUT.
- `index.html`:
  - Back-Office Global Settings input `#admin-setting-wero`.
  - Step 2 payment selector tabs `#tab-payment-revolut` and `#tab-payment-wero`.
  - Dynamic QR code generation & toggle between Revolut and Wero.
  - Updated order manifest text & receipt slip notation.
