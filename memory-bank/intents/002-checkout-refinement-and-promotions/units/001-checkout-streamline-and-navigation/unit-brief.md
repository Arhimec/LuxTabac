---
unit: 001-checkout-streamline-and-navigation
intent: 002-checkout-refinement-and-promotions
phase: inception
status: ready
created: 2026-10-19T23:16:30Z
updated: 2026-10-19T23:16:30Z
---

# Unit Brief: Checkout Streamline & Home Navigation

## Purpose

Eliminate superfluous logistics questions (delivery date and delivery notes), implement a reliable Home/Reset trigger in the header, and offer seamless tip calculation buttons (`[No tip]`, `[Round to 5€]`, `[Round to 10€]`, `[5%]`) that instantly update the order total, Revolut payment link, and receipt slip.

## Scope

### In Scope
- Remove delivery date input and delivery notes input from `index.html`.
- Update backend validation in `api/orders.js` and database handling in `api/_db.js` to treat them as optional/omitted.
- Add Home / Reset button and clickable Logo in the header to return the user to the initial clean order builder view without revoking age verification.
- Implement tip chips with live recalculation of subtotal + tip = grand total.
- Update Revolut QR code and Revolut deep-link to reflect the tip-adjusted total.
- Include tip breakdown on the Receipt Slip modal and order record.

### Out of Scope
- Modifying tobacco banderole tax rates or product database pricing.
- Modifying Revolut merchant tag popover settings.

---

## Assigned Requirements

| FR | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Remove delivery date and notes from UI and order validation | Must |
| FR-2 | Home / Reset navigation preserving age verification | Must |
| FR-3 | Interactive tip options (Round up 5€/10€ or 5%) | Must |

---

## Domain Concepts

### Tip Calculation Rules
- **Subtotal**: Sum of basket items $\sum (\text{item subtotal})$.
- **No Tip**: `tipAmount = 0.00`.
- **Round up to 5€**:
  - If subtotal is €77.00 $\rightarrow$ nearest multiple of 5 is €80.00 (`tipAmount = €3.00`).
  - If subtotal is an exact multiple of 5 (e.g. €75.00) $\rightarrow$ next multiple is €80.00 (`tipAmount = €5.00`).
- **Round up to 10€**:
  - If subtotal is €77.00 $\rightarrow$ nearest multiple of 10 is €80.00 (`tipAmount = €3.00`).
  - If subtotal is an exact multiple of 10 (e.g. €70.00) $\rightarrow$ next multiple is €80.00 (`tipAmount = €10.00`).
- **5% Tip**: `tipAmount = Math.round(subtotal * 0.05 * 100) / 100`.
- **Grand Total**: `grandTotal = subtotal + tipAmount`.
