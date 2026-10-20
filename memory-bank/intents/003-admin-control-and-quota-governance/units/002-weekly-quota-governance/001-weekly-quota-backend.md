# Story: 001-weekly-quota-backend

## Metadata
- **Unit**: 002-weekly-quota-governance
- **Intent**: 003-admin-control-and-quota-governance
- **Priority**: Must Have
- **Status**: Planned

## Description
Implement server-side calculation and enforcement of the 800-cigarette quota for the active calendar week (resetting every Monday at 00:00:00). All orders submitted by all buyers in the current week contribute to this single global quota.

## Acceptance Criteria
1. Calculate the start of the current week (most recent Monday 00:00:00 local time).
2. Query `SELECT SUM(total_cigs) FROM orders WHERE created_at >= ?` to determine `currentUsed`.
3. Provide `GET /api/quota` returning:
   ```json
   {
     "weeklyLimit": 800,
     "currentUsed": 300,
     "remaining": 500,
     "resetTimestamp": "2026-10-26T00:00:00.000Z",
     "isFull": false
   }
   ```
4. In `POST /api/orders`:
   - Calculate candidate order `totalCigs`.
   - If `currentUsed + totalCigs > 800`, reject with HTTP 400:
     ```json
     {
       "error": "WEEKLY_QUOTA_EXCEEDED",
       "message": "Weekly Luxembourg courier quota (800 cigarettes) exceeded for this week.",
       "available": 800 - currentUsed
     }
     ```
   - If within threshold, insert order and respond with HTTP 201.
