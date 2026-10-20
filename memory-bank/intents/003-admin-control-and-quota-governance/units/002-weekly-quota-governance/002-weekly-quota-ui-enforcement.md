# Story: 002-weekly-quota-ui-enforcement

## Metadata
- **Unit**: 002-weekly-quota-governance
- **Intent**: 003-admin-control-and-quota-governance
- **Priority**: Must Have
- **Status**: Planned

## Description
Provide front-end visual monitoring of the weekly 800-cigarette quota and an informative blocking modal if an order exceeds the weekly capacity.

## Acceptance Criteria
1. The builder features a live progress bar/status tag:
   - `Weekly Quota: [X] / 800 cigarettes booked ([Y] remaining) — Resets Monday 00:00`.
   - Dynamic colors: Green when < 600, Amber when 600-799, Red when full (800).
2. When the user selects a quantity that would breach the remaining allowance:
   - Basket summary displays an inline alert: `⚠️ Exceeds remaining weekly capacity (only Y cigarettes available this week)`.
   - Submit button is disabled or triggers a clear modal:
     - Title: `Weekly Courier Threshold Reached`
     - Explanation: In compliance with EU cross-border transit regulations, weekly transit capacity is capped at 800 cigarettes across all consignments. Capacity resets on Monday at 00:00.
3. If an order attempt fails with `WEEKLY_QUOTA_EXCEEDED` from the backend, the modal pops up immediately, preventing navigation to Step 2.
