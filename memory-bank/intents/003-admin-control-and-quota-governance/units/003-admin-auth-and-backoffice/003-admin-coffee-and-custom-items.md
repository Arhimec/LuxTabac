# Story: 003-admin-coffee-and-custom-items

## Metadata
- **Unit**: 003-admin-auth-and-backoffice
- **Intent**: 003-admin-control-and-quota-governance
- **Priority**: Must Have
- **Status**: Planned

## Description
Provide administrative management for promotional coffee items (manual entries only) and review/pricing adjustments for custom cigarette items entered by buyers.

## Acceptance Criteria
1. **Coffee Products (Manual Admin Entries Only)**:
   - Admin can view, add, edit, and delete coffee cards (Brand, Title, Pack Quantity, Format, Price, Badge, Highlight).
   - Changes immediately reflect in the public `#coffee-pods-showcase` (when visibility is enabled).
2. **Buyer Custom Cigarette Entries**:
   - When a buyer submits a manual cigarette entry (Brand & Model) in the order builder, it is persisted to `custom_items` in SQLite.
   - It becomes visible in the public dropdown for all subsequent buyers.
   - In the Admin back-office, admin sees a "Custom Tobacco Review" table showing all buyer-entered items with their current price.
   - Admin can update/adjust the official pack price and carton price, which updates the item across the dropdown catalog for all users.
