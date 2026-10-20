# Requirements: Intent 004 - Wero QR Payment Method

## Overview
Expand the LuxTabac Reserve payment suite by introducing **Wero** (European Payments Initiative instant account-to-account wallet) as a first-class payment method alongside Revolut. Buyers in Step 2 can toggle between Revolut and Wero, with dynamically generated QR codes, recipient badges, transfer references, and one-click app launch/payment links.

## User Needs & Business Context
- Luxembourg and cross-border European buyers (France, Germany, Belgium) widely utilize Wero for instant mobile banking transfers.
- Offering Wero in addition to Revolut provides a seamless, zero-friction alternative for customers who do not use Revolut.
- Store administrators must maintain the Wero recipient handle/phone number/payment link in the existing Back-Office portal without modifying code.

## Functional Requirements (FR)

### FR-001: Admin Wero Settings Management
- **FR-001.1**: The `app_settings` SQLite table shall store a new configuration key `wero_recipient` (defaults to `+352 691 000 000` or custom Wero handle/pay link).
- **FR-001.2**: `/api/settings` (GET and PUT) shall return and update `weroRecipient` with full admin bearer token authorization.
- **FR-001.3**: The Back-Office modal ("Global Settings" tab) shall feature a dedicated input field for the Wero recipient (phone number, email, or Wero Pay URL) with instant save feedback.

### FR-002: Dual Payment Method Switcher in Step 2
- **FR-002.1**: Step 2 (Payment View) shall present prominent, luxury payment selector tabs/toggle:
  - ⚡ **Revolut** (`revolut.me/@revtag`)
  - 🇪🇺 **Wero** (European Instant Pay QR)
- **FR-002.2**: Switching tabs shall instantly re-render the appropriate QR code, recipient badge, transfer instructions, and direct action CTA button without losing order details or reference code.
- **FR-002.3**: Order history, receipt slips, and WhatsApp manifests shall reflect the active payment method chosen by the customer.

### FR-003: Dynamic Wero QR Code & Transfer Payload
- **FR-003.1**: When Wero is selected, the system shall dynamically generate an ISO/EPC compliant QR code containing the order amount, unique order reference (`LT-XXXXXX`), and recipient details.
- **FR-003.2**: A direct launch / pay CTA button ("Pay with Wero App") shall open the Wero deep link or copy recipient details for instant in-app payment.
- **FR-003.3**: A clean copy-to-clipboard button shall allow the buyer to copy the Wero recipient phone/handle and reference.

## Non-Functional Requirements (NFR)
- **NFR-001 (Performance)**: QR code generation and tab switching must execute purely clientside within <50ms without external blocking scripts.
- **NFR-002 (Security)**: Administrative settings for Wero recipient remain strictly protected behind existing admin session token authorization.
- **NFR-003 (UX / Visual Aesthetics)**: The payment method switcher must adhere to LuxTabac Reserve's dark luxury aesthetic (zinc-900/950, amber-500 highlights, smooth transitions, mobile responsive).
- **NFR-004 (Offline & Fallback Resilience)**: If the buyer is on desktop or Wero app deep linking is unavailable, clear fallback instructions (copy phone/IBAN/reference) are provided.
