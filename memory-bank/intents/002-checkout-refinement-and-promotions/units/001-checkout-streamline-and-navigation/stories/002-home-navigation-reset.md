---
story: 002-home-navigation-reset
unit: 001-checkout-streamline-and-navigation
intent: 002-checkout-refinement-and-promotions
phase: inception
status: ready
created: 2026-10-19T23:16:55Z
updated: 2026-10-19T23:16:55Z
---

# Story: Home & Reset Navigation

**As a** shopper who has already completed age verification,
**I want** to click the logo or a "Home" button in the navigation header,
**So that** I can instantly return to Step 1 and reset my order builder to a clean slate without being blocked or asked to re-verify my age.

## Acceptance Criteria

- [ ] The header brand logo and title are interactive links/buttons with cursor pointer and hover effects.
- [ ] A dedicated "Home" button or logo click triggers a reset:
  - If on Step 2 (Revolut Payment), switches back to Step 1 (Order Builder).
  - Clears or resets the active cigarette selection and basket if user confirms or directly navigates.
  - Scrolls to top smoothly.
- [ ] `sessionStorage.getItem('luxtabac_age_verified')` is preserved so the 18+ modal is never displayed again during the session.
- [ ] Drawer or modal overlays (History drawer, Receipt slip, Price explorer) close automatically when navigating Home.
