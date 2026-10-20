# Story: 001-tip-options-refactor

## Metadata
- **Unit**: 001-tip-and-catalog-refinements
- **Intent**: 003-admin-control-and-quota-governance
- **Priority**: Must Have
- **Status**: Planned

## Description
Replace the dual round-up buttons (`Round 5€` and `Round 10€`) with a single `Round Up` button that rounds up to the nearest multiple of 5 EUR (or adds 5.00 EUR if already a multiple).
Refactor the `5% Tip` button so that its value is rounded DOWN to the nearest whole 1 EUR (`Math.floor(subtotal * 0.05)`).

## Acceptance Criteria
1. UI presents three tip chips: `No tip`, `Round Up (to 5€)`, `5% Tip (whole €)`.
2. For an order subtotal of €77.00:
   - `Round Up`: €3.00 tip (Total: €80.00).
   - `5% Tip`: `Math.floor(77 * 0.05)` = €3.00 tip (Total: €80.00).
3. For an order subtotal of €132.00:
   - `Round Up`: €3.00 tip (Total: €135.00).
   - `5% Tip`: `Math.floor(132 * 0.05)` = €6.00 tip (Total: €138.00).
4. If subtotal is already exact multiple of 5 (e.g. €80.00), `Round Up` adds €5.00 (Total: €85.00).
5. All live recalculations (CTA button, Step 2 summary, Revolut URL, QR code, receipt, and database) reflect the updated calculations.
