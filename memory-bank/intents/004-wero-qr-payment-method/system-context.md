# System Context: Intent 004 - Wero QR Payment Method

## Architecture Overview

```mermaid
flowchart TD
    Admin[Store Administrator] -->|1. Configure Wero Handle/Phone| BackOffice[Back-Office Modal]
    BackOffice -->|2. PUT /api/settings| SettingsAPI[/api/settings Endpoint]
    SettingsAPI -->|3. Persist wero_recipient| SQLite[(SQLite app_settings)]
    
    Buyer[Customer / Buyer] -->|4. Confirm Order Basket| CheckoutForm[Order Checkout Form]
    CheckoutForm -->|5. Open Step 2: Payment| PaymentView[Step 2: Dual Payment View]
    
    PaymentView -->|Tab A: Revolut| RevolutQR[Revolut QR & Link]
    PaymentView -->|Tab B: Wero| WeroQR[Wero Instant QR & Transfer Payload]
    
    PaymentView -->|Sync / Share| WhatsApp[WhatsApp Order Manifest]
    PaymentView -->|Order Record| DBOrders[(SQLite orders Table)]
```

## Data Schema & Settings Extensions
1. **`app_settings` (SQLite)**:
   - Key: `'wero_recipient'`
   - Default value: `'+352 691 000 000'` (or custom admin handle / pay link)
2. **`orders` (SQLite)**:
   - `payment_method` column or manifest field storing `'revolut'` or `'wero'`.

## Frontend Integration Points
- **Admin Modal (`#admin-panel-settings`)**:
  - Add `#admin-setting-wero`: Input field for Wero Recipient Phone / Handle / Link.
- **Step 2 Header / Payment Card (`#payment-view`)**:
  - Header pill update: "2. Payment (Revolut / Wero)" instead of hardcoded Revolut only.
  - Payment method switch tabs: `#btn-pay-tab-revolut` and `#btn-pay-tab-wero`.
  - Dynamic QR container & details:
    - When Revolut: `revolut.me/@<revtag>`, Revolut QR code, Revolut app direct link.
    - When Wero: Wero Recipient pill, Wero QR code, Wero app launch / copy action.
  - WhatsApp & Receipt Manifest:
    - Mentions selected payment method (`Revolut` or `Wero`).
