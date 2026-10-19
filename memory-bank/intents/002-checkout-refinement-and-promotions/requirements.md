---
intent: 002-checkout-refinement-and-promotions
phase: inception
status: complete
created: 2026-10-19T23:10:00Z
updated: 2026-10-19T23:10:00Z
---

# Requirements: Checkout Refinement & Cross-Category Promotions

## Intent Overview

Streamline the customer checkout workflow by removing unnecessary delivery logistics fields (delivery date and delivery notes), introducing an intuitive "Home / Reset" action in the header, adding an interactive optional tip selector (`[No tip]`, `[Round to 5€]`, `[Round to 10€]`, `[5%]`) that updates the grand total and Revolut QR payment payload, and introducing a promotional showcase section for high-demand non-tobacco products (e.g. coffee pods: brand, pack size, price) with inquiry guidance.

## Business Goals

| Goal | Success Metric | Priority |
|------|----------------|----------|
| Simplify Order Funnel | Eliminate redundant logistics inputs (delivery date, delivery notes) reducing friction | Must |
| Provide Predictable Navigation | Clicking Logo / Home button resets state back to Step 1 without dropping 18+ verification | Must |
| Enable Optional Tipping | Provide Round-Up (5€ / 10€) or 5% tip options reflected in live Revolut QR amount | Must |
| Showcase Cross-Category Promos | Display popular coffee pod brands, quantities, and competitive Luxembourg prices | Must |
| Maintain Backward Compatibility | Existing orders in SQLite and API endpoints continue working smoothly | Must |

---

## Functional Requirements

### FR-1: Remove Delivery Date and Delivery Notes
- **Description**: Remove `deliveryDate` and `deliveryNotes` inputs from the UI order builder form and make them optional/omitted in order submission payloads.
- **Acceptance Criteria**:
  - Date input and delivery notes input removed from the order builder HTML.
  - Form validation passes without requiring delivery date.
  - API and backend (`api/_db.js`, `api/orders.js`) accept payloads without `deliveryDate` or `deliveryNotes` without errors.
  - Rebuy logic safely ignores absent delivery notes and dates.
- **Priority**: Must

### FR-2: Home / Reset Navigation
- **Description**: Provide a direct way to return "Home" in the header after age verification is complete.
- **Acceptance Criteria**:
  - Clicking the LuxTabac Reserve header logo/brand or dedicated "Home" button resets active order view to Step 1.
  - Clears active form fields and resets active items or offers a clean fresh state.
  - Age verification status in `sessionStorage` remains intact (no re-prompting 18+ modal).
- **Priority**: Must

### FR-3: Optional Interactive Tip Calculation
- **Description**: Add interactive tip selector chips before submitting the order (`[No tip]`, `[Round up to 5€]`, `[Round up to 10€]`, `[5%]`).
- **Acceptance Criteria**:
  - If current subtotal is €77.00:
    - `Round up to 5€` $\rightarrow$ rounds up to nearest 5 EUR (€80.00, tip = €3.00). If already on exact 5 EUR, rounds to next 5 EUR (+€5.00).
    - `Round up to 10€` $\rightarrow$ rounds up to nearest 10 EUR (€80.00, tip = €3.00). If subtotal is €70.00, rounds to €80.00 (+€10.00).
    - `5%` $\rightarrow$ adds 5% of subtotal (€3.85, total = €80.85).
    - `No tip` $\rightarrow$ tip = €0.00.
  - Grand total, Revolut transfer link, Revolut QR code, and receipt slip reflect the tip breakdown and final amount.
  - Stored in order metadata as `tipAmount` and included in order history.
- **Priority**: Must

### FR-4: Promotional Products Showcase (Coffee Pods & More)
- **Description**: Display a dedicated promotional section showcasing popular high-demand items (e.g. coffee pods: Senseo, Nespresso compatible, Dolce Gusto, Lavazza, Dallmayr) highlighting brand, pack quantity (e.g., 36 pods, 100 pods), and competitive Luxembourg pricing.
- **Acceptance Criteria**:
  - Rendered in a sleek, branded card section below or alongside catalog features.
  - Features clear brand badges, pack sizes/quantities, Luxembourg tax-advantage price comparison or duty-free price tags.
  - Includes a clear action/note for ordering or bundling these items with tobacco orders.
- **Priority**: Must

---

## Non-Functional Requirements

### Usability & Responsiveness
| Requirement | Metric | Target |
|-------------|--------|--------|
| Mobile First | Viewport adaptation | Flawless rendering on iOS Safari & Android Chrome |
| Tip calculation speed | Real-time DOM reaction | Instant (<16ms, 60fps) update to totals and QR payload |
| Dark Mode Aesthetic | Design consistency | Strict adherence to zinc-950/zinc-900 and amber-500 luxury theme |

### Security & Compliance
| Requirement | Metric | Target |
|-------------|--------|--------|
| Age Verification Retention | Session state | Retain 18+ verification while returning Home |
| Input Sanitization | XSS prevention | All dynamically rendered promo labels & tips run through `escapeHTML()` |
