---
id: 005-one-click-rebuy
unit: 002-order-history-ui
intent: 001-order-persistence-and-history
priority: Must
status: complete
created: '2026-10-19T21:24:40Z'
implemented: true
---

# Story: Instant One-Click Rebuy

## As a
Cross-Border Shopper

## I want
A "Rebuy This Basket" button on each past order card

## So that
I can instantly restock my usual brand and quantity into the active checkout without manually re-adding every item.

## Acceptance Criteria
- [ ] Prominent "Rebuy This Basket" button on expanded order card (min touch target $44 \times 44\text{px}$)
- [ ] If cart is not empty, prompts user with quick inline confirmation or toast
- [ ] Clears current basket and populates items and quantities from the historical order
- [ ] Closes drawer, smoothly scrolls to order summary / checkout form
- [ ] Displays toast: `"Restored N items from order #LU-XXXX"`
- [ ] Auto-recalculates EU allowance tracker and grand total
