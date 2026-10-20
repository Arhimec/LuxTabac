# Implementation Walkthrough: Bolt 006 - Weekly Quota Governance

## 1. Summary of Changes

This bolt implemented strict global weekly quota governance (800 cigarettes combined across all customer consignments per calendar week, resetting every Monday at 00:00:00), executing stories `001-weekly-quota-backend` and `002-weekly-quota-ui-enforcement`:

### 1.1. Backend Aggregation & Calendar Monday Reset (Story 001)
- **`api/_db.js`**:
  - Implemented `getWeekStartMonday(refDate)`: Calculates the start of the current week (most recent Monday at 00:00:00) handling month and year boundaries reliably.
  - Implemented `getNextMonday(refDate)`: Computes the next Monday at 00:00:00 using daylight-saving-safe date arithmetic (`next.setDate(next.getDate() + 7)`).
  - Implemented `getWeeklyCigaretteTotal(refDate)`: Runs `SELECT COALESCE(SUM(total_cigs), 0) AS total_used FROM orders WHERE datetime(created_at) >= datetime(?)`.
  - Implemented `getQuotaStatus(refDate)`: Returns `{ weeklyLimit: 800, currentUsed, remaining, resetTimestamp, isFull }`.
- **`api/quota.js`**:
  - Created serverless API endpoint handling `GET /api/quota` returning current telemetry and HTTP 405 on unsupported methods.
- **`api/orders.js`**:
  - In `POST /api/orders`, added quota enforcement before insertion:
    - Calculates candidate order cigarette volume (`candidateCigs`).
    - If `currentWeeklyUsed + candidateCigs > 800`, returns HTTP 400 Bad Request with code `WEEKLY_QUOTA_EXCEEDED`, providing current usage, available capacity, and requested volume.
- **`server.js` & `vercel.json`**:
  - Registered `/api/quota` serverless routing for local development and Vercel cloud deployments.

### 1.2. Frontend Capacity Meter & Quota Enforcement (Story 002)
- **Capacity Meter (`#weekly-quota-container`)**:
  - Added a luxury capacity meter below the builder showing:
    - Status dot and dynamic badge: `<600` green ("Available"), `600-799` amber ("Filling Fast"), `800` red ("Fully Booked").
    - Real-time booked count and remaining capacity.
    - Animated progress bar showing capacity filled percentage.
    - Weekly reset schedule notice: "Resets Monday 00:00".
- **Inline Over-Quota Warning (`#quota-inline-alert`)**:
  - Appears automatically in the builder when the candidate selection or basket exceeds the remaining weekly capacity.
- **Blocking Modal (`#quota-exceeded-modal`)**:
  - Pops up if the user attempts to submit an order exceeding remaining capacity:
    - Title: **"Weekly Courier Threshold Reached"**.
    - Detail: Explains the collective 800-cigarette EU transit limit and Monday 00:00 reset.
    - Displays exact weekly limit (800), currently booked, available remaining, and requested volume.
    - Provides "Adjust Basket Quantity" button to return and reduce volume.
- **Reactivity & Synchronization**:
  - Initialized with `fetchQuotaStatus()` on page load.
  - Reactively refreshes quota telemetry after orders are placed.
