---
id: 008-wero-qr-payment-integration
unit: 001-wero-payment-integration
intent: 004-wero-qr-payment-method
type: simple-construction-bolt
status: complete
stories:
  - 001-admin-wero-settings
  - 002-payment-method-selector-tabs
  - 003-wero-qr-code-generation
created: '2026-10-20T21:35:00Z'
started: '2026-10-20T21:40:00Z'
completed: '2026-10-21T19:20:00Z'
current_stage: 3. Test
stages_completed:
  - 1. Plan
  - 2. Implement
  - 3. Test
requires_bolts:
  - 007-admin-portal-and-backoffice
enables_bolts: []
requires_units: []
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 008-wero-qr-payment-integration

## Overview

Implement Wero (European Payments Initiative instant account-to-account wallet) as an official payment option alongside Revolut:
1. Store and manage Wero recipient configuration (`wero_recipient`) in SQLite database and Back-Office Global Settings.
2. Provide a luxury dual-tab payment switcher (Revolut vs Wero) on Step 2 with real-time recalculation.
3. Dynamically generate Wero QR codes containing order amount and reference, provide copy and direct payment launch actions, and update order manifests/receipt slips.

## Objective

1. Enable store administrators to configure Wero recipient credentials in the Back-Office portal.
2. Allow buyers to toggle between Revolut and Wero payment methods on the payment screen.
3. Render verified Wero QR codes and payment actions, ensuring consistency in receipt slips and WhatsApp messages.

## Stories Included

- **001-admin-wero-settings**: Admin configuration of Wero recipient in Back-Office and SQLite `app_settings` via `/api/settings`.
- **002-payment-method-selector-tabs**: Buyer payment method selector tabs in Step 2 with real-time recalculation and dynamic instructions.
- **003-wero-qr-code-generation**: Dynamic Wero QR code generation with amount, order reference, recipient badge, direct launch CTA, and receipt/manifest integration.

## Bolt Type

**Type**: Simple Construction Bolt

## Stages

- [x] **1. Plan**: Complete → implementation-plan.md
- [x] **2. Implement**: Complete → api/_db.js, api/settings.js, api/orders.js, index.html
- [x] **3. Test**: Complete → tests/bolt-008.test.js, test-walkthrough.md
