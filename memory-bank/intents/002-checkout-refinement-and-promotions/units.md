---
intent: 002-checkout-refinement-and-promotions
phase: inception
status: units-decomposed
updated: 2026-10-19T23:16:15Z
---

# 002-checkout-refinement-and-promotions - Unit Decomposition

## Units Overview

This intent decomposes into 2 units of work:

### Unit 1: 001-checkout-streamline-and-navigation

**Description**: Removes delivery date and delivery notes from UI inputs, adjusts backend schema and API validation, adds a Home / Reset action in the header, and implements interactive tip selector chips (`[No tip]`, `[Round to 5€]`, `[Round to 10€]`, `[5%]`).

**Stories**:
- Story-1: `001-remove-logistics-fields.md` — Remove delivery date and notes from UI and order validation.
- Story-2: `002-home-navigation-reset.md` — Implement Header Home/Logo reset action while maintaining 18+ verification.
- Story-3: `003-interactive-tip-chips.md` — Interactive tip options with real-time recalculation of total, Revolut QR, and receipt.

**Deliverables**:
- Form cleanup in `index.html`.
- New Tip selector UI and calculations in `index.html`.
- Updated order schema and validation in `api/_db.js` and `api/orders.js`.
- Header logo/home reset click handlers.

**Dependencies**:
- Depends on: Existing order persistence and UI.
- Depended by: Unit 2.

**Estimated Complexity**: Medium (M)

---

### Unit 2: 002-promotional-cross-category-showcase

**Description**: Adds a curated showcase card section to promote popular non-tobacco tax-advantaged goods in Luxembourg (such as coffee pods: Senseo, Nespresso compatible, Dolce Gusto, Lavazza) displaying brand, pack quantity, and price.

**Stories**:
- Story-1: `001-coffee-pods-showcase.md` — Branded promo showcase cards with contact/inquiry notice.

**Deliverables**:
- HTML/CSS promo showcase section in `index.html`.
- Brand cards with product metadata (brand, format, quantity, price).
- Contact note / inquiry guidance for shoppers.

**Dependencies**:
- Depends on: Unit 1.

**Estimated Complexity**: Small (S)

## Unit Dependency Graph

```text
[001-checkout-streamline-and-navigation] ──> [002-promotional-cross-category-showcase]
```

## Execution Order

1. Unit 1: Checkout Streamline, Home Navigation & Tip Options
2. Unit 2: Promotional Cross-Category Showcase
