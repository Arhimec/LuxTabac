# Story: 003-wero-qr-code-generation

## Story Metadata
- **ID**: `003-wero-qr-code-generation`
- **Unit**: `001-wero-payment-integration`
- **Intent**: `004-wero-qr-payment-method`
- **Priority**: Must
- **Status**: Completed

## Description
As a buyer selecting Wero,
I want to scan a verified QR code with my mobile banking or Wero app, and click a direct action button to pay,
So that I can finalize my transfer immediately with the exact order total and payment reference.

## Acceptance Criteria
1. Dynamic QR Code Generation:
   - When Wero is selected, the QR canvas/SVG renders a verified payload containing the Wero recipient, amount (EUR), and order reference (`LT-XXXXXX`).
   - If an EPC/SEPA instant or Wero URL payload is formatted, the QR code reflects it directly.
2. Direct Action & Recipient Badge:
   - Recipient badge updates dynamically to display `wero: <weroRecipient>` (e.g. `wero: +352 691 000 000`).
   - Direct payment button updates to "Pay with Wero App" (or copy Wero details if direct app link is not supported by client device).
   - "Copy Wero Details" helper button copies the recipient and reference to clipboard with toast confirmation.
3. Order Manifest & Receipt Integration:
   - Receipt slip modal reflects payment method ("PAYMENT: Wero Instant Transfer" or "PAYMENT: Revolut P2P").
   - WhatsApp order manifest text identifies the chosen payment method and recipient reference.
