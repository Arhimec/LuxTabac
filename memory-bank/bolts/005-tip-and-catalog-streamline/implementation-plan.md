# Implementation Plan: Bolt 005 - Tip and Catalog Streamline

## 1. Goal
Execute the 3 stories in Unit 001:
1. **001-tip-options-refactor**:
   - Change tip chips in `index.html` from 4 chips to 3 chips:
     - `No tip` (`data-tip="none"`)
     - `Round Up` (`data-tip="round-5"`)
     - `5% Tip` (`data-tip="percent-5-down"`)
   - Math adjustments:
     - `round-5`: `subtotal % 5 === 0 ? 5.00 : Math.round((5 - (subtotal % 5)) * 100) / 100` (e.g. 77€ ➔ +3€ = 80€; 80€ ➔ +5€ = 85€).
     - `percent-5-down`: `Math.floor(subtotal * 0.05)` (e.g. 77€ ➔ 3.85€ rounded down = 3€; 132€ ➔ 6.60€ rounded down = 6€; 80€ ➔ 4€; <20€ ➔ 0€).
2. **002-luxembourg-cigarette-catalog**:
   - Expand `OFFICIAL_CATALOG` in `index.html`:
     - Keep all manufactured cigarette brands/models (Marlboro, Camel, Lucky Strike, Winston, Gauloises, Chesterfield, Philip Morris, Dunhill, Kent, Vogue, Davidoff, Benson & Hedges, Pall Mall, JPS, Fortuna, News, Ducados, L&M, Peter Stuyvesant).
     - RETAIN ONLY manufactured cigarettes (filter cigarettes, 20-pack and 10x20 carton).
     - Remove any rolling tobacco / volume bucket / chopped tobacco references.
     - Ensure pack and carton prices reflect official 2026 Luxembourg pricing.
3. **003-buyer-name-prefiltering**:
   - In `index.html`, add `#name-reorder-prompt` below `#customer-name`.
   - On `#customer-name` input/blur:
     - Search cached history orders (`cachedHistoryOrders` from API/local) for matches with the entered name.
     - If a match is found with items, display a luxury amber badge: `⚡ Reorder your usual: [Brand] [Model] ([Format])` with a clickable trigger.
     - Clicking the prompt auto-selects the brand in the dropdown, sets carton/pack format, and updates UI totals immediately.

## 2. Testing Strategy
- Create `tests/bolt-005.test.js` validating:
  - Tipping chips structure and math (Round up to 5, 5% rounded down to 1 EUR).
  - Catalog integrity: verify only manufactured cigarettes exist, ensure no chopped tobacco entries exist.
  - Buyer name pre-filtering UI elements and behavior.
- Run `npm test`.
- Visual validation in browser.
