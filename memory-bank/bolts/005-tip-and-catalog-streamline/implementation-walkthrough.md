# Implementation Walkthrough: Bolt 005 - Tip and Catalog Streamline

## 1. Summary of Changes

This bolt successfully executed stories `001-tip-options-refactor`, `002-luxembourg-cigarette-catalog`, and `003-buyer-name-prefiltering`:

### 1.1. Single Round-Up & Floored 5% Tip (Story 001)
- Replaced the previous 4-chip tip selector in `index.html` with exactly 3 options:
  - `No tip` (`data-tip="none"`)
  - `Round Up` (`data-tip="round-5"`): rounds subtotal up to nearest 5 EUR; if exact multiple of 5, adds 5.00 EUR.
  - `5% Tip` (`data-tip="percent-5"`): computes 5% of subtotal rounded **down** to the nearest whole 1 EUR (`Math.floor(subtotal * 0.05)`).
- Updated real-time calculation in `calculateTip(subtotal, mode)` and UI reactivity across basket total, submit button text, Step 2 summary row, Revolut link, QR code, and receipt.

### 1.2. Complete Manufactured Cigarette Catalog (Story 002)
- Expanded `LU_2026_CATALOG` to cover all major manufactured cigarette brands and models in Luxembourg:
  - Marlboro, Camel, Lucky Strike, Winston, Gauloises & Gitanes, Chesterfield, Philip Morris, Dunhill, Kent, Vogue, Davidoff, Benson & Hedges, Pall Mall, L&M, JPS, Peter Stuyvesant, Fortuna, Ducados, News, Ducal, Elixyr, Che, Austin, West, Mademoiselle.
- **Rigorously removed all non-cigarette chopped tobacco**:
  - Removed "Rolling & Tubing Tobacco (Pots / Buckets)".
  - Removed all pot/volume bucket items (`isPot: true`, 150g, 175g, 200g, 500g pots).
  - Ensured only manufactured packs (20s) and cartons (10x20s) are offered.

### 1.3. Returning Buyer Name History Matching & Pre-filtering (Story 003)
- Added `#name-reorder-container` and `#name-lookup-status` under `#customer-name`.
- Attached real-time debounced listeners to `#customer-name`:
  - When the customer enters their name (>= 2 chars), searches `cachedHistoryOrders` for previous orders matching that name.
  - Displays: `⚡ Order history match: [Brand] [Model] ([Format])` with a **Quick Reorder** button.
  - Clicking **Quick Reorder** automatically switches to catalog mode, pre-selects the brand in the dropdown, sets the format (Carton/Pack), restores quantity, updates totals, and toasts confirmation.
- Resets seamlessly on "Home" navigation.
