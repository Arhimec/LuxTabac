---
story: 001-remove-logistics-fields
unit: 001-checkout-streamline-and-navigation
intent: 002-checkout-refinement-and-promotions
phase: inception
status: ready
created: 2026-10-19T23:16:45Z
updated: 2026-10-19T23:16:45Z
---

# Story: Remove Delivery Date and Delivery Notes

**As a** customer ordering tobacco products,
**I want** to complete my order without being asked for delivery dates or delivery notes,
**So that** checkout is fast, frictionless, and focused strictly on product selection and Revolut payment.

## Acceptance Criteria

- [ ] HTML element `#delivery-date` container is completely removed from `#cigarette-order-form`.
- [ ] HTML element `#delivery-notes` container is completely removed from `#cigarette-order-form`.
- [ ] Form submission validation does not check or require `deliveryDate`.
- [ ] Backend handler in `api/orders.js` does not reject orders missing `deliveryDate`.
- [ ] Backend database schema in `api/_db.js` accepts orders with null/empty `deliveryDate` and `deliveryNotes`.
- [ ] Order receipt slip and history drawer display cleanly without empty delivery date/notes rows.
- [ ] Existing automated unit and integration tests are updated and passing.
