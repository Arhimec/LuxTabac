# Implementation Plan: Bolt 006 - Weekly Quota Governance

## 1. Goal
Implement strict global weekly quota governance (800 cigarettes combined across all customer consignments per calendar week, resetting every Monday at 00:00:00).

Stories addressed:
1. **001-weekly-quota-backend**:
   - `api/_db.js`:
     - Add `getWeekStartMonday(date)` helper returning the start of the current week (Monday 00:00:00 ISO).
     - Add `getNextMonday(date)` helper returning the next reset time (Monday 00:00:00 ISO).
     - Add `getWeeklyCigaretteTotal(sinceDate)` query: `SELECT COALESCE(SUM(total_cigs), 0) AS total_used FROM orders WHERE created_at >= ?`.
     - Add `getQuotaStatus()` returning `{ weeklyLimit: 800, currentUsed, remaining, resetTimestamp, isFull }`.
   - `api/quota.js`:
     - New Serverless route handling `GET /api/quota` returning current quota telemetry.
   - `api/orders.js`:
     - In `POST /api/orders`, enforce quota check: if `currentUsed + requestedTotalCigs > 800`, reject with HTTP 400 and code `WEEKLY_QUOTA_EXCEEDED`.
   - `server.js` & `vercel.json`:
     - Register `/api/quota` endpoint routing.

2. **002-weekly-quota-ui-enforcement**:
   - `index.html`:
     - Add a sleek luxury weekly quota capacity banner in the builder (#quota-meter-container) with:
       - Status badge (`Weekly Capacity: X / 800 cigs booked (Y remaining)`).
       - Visual animated progress bar with dynamic color grading (emerald <600, amber 600-799, crimson 800).
       - Reset notice: `Resets Monday at 00:00`.
     - Add inline warning in the basket summary if active basket exceeds remaining capacity.
     - Add modal `#quota-modal` with clear explanation of the 800-cig cross-border transit cap, reset timeline, and guidance to reduce quantity.
     - Wire up client-side check on `Proceed to Payment` and backend catch for `WEEKLY_QUOTA_EXCEEDED`.
     - Live fetch of `/api/quota` on initialization and after successful order placement.

## 2. Testing Strategy
- Create `tests/bolt-006.test.js`:
  - Unit test `getWeekStartMonday()` logic across different days of the week (Monday, Wednesday, Sunday).
  - Test SQLite quota summation with orders created before and after current week Monday.
  - Test `GET /api/quota` response format and calculations.
  - Test `POST /api/orders` rejection with HTTP 400 when order exceeds 800 cigarettes.
  - Test `POST /api/orders` success when within 800 limit.
  - Verify UI elements in `index.html` (meter, progress bar, warning modal).
- Full browser interaction check via `browser_subagent`.
- Run all test suites with `npm test`.
