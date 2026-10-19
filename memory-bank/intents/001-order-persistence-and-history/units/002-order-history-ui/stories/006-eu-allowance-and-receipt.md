---
id: 006-eu-allowance-and-receipt
unit: 002-order-history-ui
intent: 001-order-persistence-and-history
priority: Should
status: complete
created: '2026-10-19T21:24:50Z'
implemented: true
---

# Story: EU Allowance Tracker & Receipt Slip Export

## As a
Cross-Border Shopper

## I want
Visual EU 800-cigarette allowance tracking and a clean exportable/printable receipt slip

## So that
I stay informed on legal cross-border transport thresholds and can keep digital or printed proof of my order.

## Acceptance Criteria
- [ ] Computes total cigarettes in active basket and past orders (carton = 200 cigs, rolling tobacco = 1g/cig eq)
- [ ] Displays badge: `"Within EU Guideline (<800 cigs)"` (emerald) or `"Exceeds EU 800-cig Guideline"` (amber warning)
- [ ] "Receipt Slip" action opens a clean mobile modal/slip showing order ID, items, grand total, and payment reference
- [ ] Includes "Copy Receipt Text" button and `@media print` print-friendly styling
