# Units of Delivery: Intent 004 - Wero QR Payment Method

## Unit Decomposition

This intent is structured into 1 focused, high-cohesion unit:

### Unit 001: 001-wero-payment-integration
- **Purpose**: Implement full end-to-end Wero payment integration, spanning SQLite settings persistence, Back-Office recipient configuration, Step 2 dual-payment selector tabs, dynamic Wero QR code generation, and receipt/WhatsApp sync.
- **Stories**:
  1. `001-admin-wero-settings`: Admin configuration of Wero recipient in Back-Office and SQLite `app_settings` via `/api/settings`.
  2. `002-payment-method-selector-tabs`: Buyer payment method selector tabs in Step 2 with real-time recalculation and dynamic instructions.
  3. `003-wero-qr-code-generation`: Dynamic Wero QR code generation with amount, order reference, recipient badge, direct launch CTA, and receipt/manifest integration.
