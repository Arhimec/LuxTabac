# Story: 003-buyer-name-prefiltering

## Metadata
- **Unit**: 001-tip-and-catalog-refinements
- **Intent**: 003-admin-control-and-quota-governance
- **Priority**: Must Have
- **Status**: Planned

## Description
When a returning buyer enters their name in the order form, the system searches existing order records and automatically suggests or pre-filters their previously ordered cigarette brand and format.

## Acceptance Criteria
1. When a customer types or selects their name in `#customer-name` (debounced or on blur):
   - Client checks local history / cached orders for orders matching that customer name.
   - If a previous order is found, a subtle prompt appears: `⚡ Reorder your usual: [Brand] [Model] ([Format])` with a 1-click apply button.
2. Clicking the quick reorder chip selects the brand in the dropdown, restores the format (carton/pack), and updates the price.
3. If no matching prior orders exist, no prompt is displayed.
