---
story: 003-interactive-tip-chips
unit: 001-checkout-streamline-and-navigation
intent: 002-checkout-refinement-and-promotions
phase: inception
status: ready
created: 2026-10-19T23:17:05Z
updated: 2026-10-19T23:17:05Z
---

# Story: Interactive Tip Options

**As a** customer ordering Luxembourg tobacco products,
**I want** to optionally add a tip (round up to nearest 5€ or 10€, or 5%) before submitting,
**So that** I can show appreciation and have the exact tip amount calculated and included seamlessly in the Revolut transfer and payment QR code.

## Acceptance Criteria

- [ ] A dedicated "Optional Courier Tip" section is added to the order builder above the review/submit button.
- [ ] 4 interactive pill/chip options:
  - `No tip` (default, selected state highlighted)
  - `Round up to 5€`
  - `Round up to 10€`
  - `5%`
- [ ] Real-time computation and display:
  - Displays calculated tip amount in euros (e.g., `+€3.00 tip`) next to the chip or total.
  - Updates Basket Total display dynamically.
- [ ] When proceeding to Step 2 (Revolut Payment):
  - Revolut payment URL includes the grand total including tip (`grandTotal = subtotal + tipAmount`).
  - Revolut QR code encodes the tip-augmented transfer amount.
  - Receipt slip itemizes the subtotal, tip amount, and grand total.
- [ ] Tip amount is passed in the order creation payload to `/api/orders` and persisted in SQLite.
