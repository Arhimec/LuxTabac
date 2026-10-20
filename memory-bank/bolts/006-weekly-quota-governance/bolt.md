---
id: 006-weekly-quota-governance
unit: 002-weekly-quota-governance
intent: 003-admin-control-and-quota-governance
type: simple-construction-bolt
status: pending
stories:
  - 001-weekly-quota-backend
  - 002-weekly-quota-ui-enforcement
created: '2026-10-20T19:47:00Z'
started: null
completed: null
current_stage: null
stages_completed: []
requires_bolts:
  - 005-tip-and-catalog-streamline
enables_bolts:
  - 007-admin-portal-and-backoffice
requires_units: []
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 006-weekly-quota-governance

## Overview

Implement the strict 800-cigarette global weekly quota across all customer consignments, resetting every Monday at 00:00. Includes backend validation, `/api/quota` telemetry endpoint, client capacity meter, and a blocking warning modal if an order exceeds the weekly allowance.

## Objective

1. Calculate current calendar week (Monday 00:00 to Sunday 23:59:59) total cigarettes booked in SQLite.
2. Provide `GET /api/quota` and reject exceeding orders with HTTP 400 (`WEEKLY_QUOTA_EXCEEDED`).
3. Display a live weekly capacity meter and present a blocking modal if 800 cigarettes are exceeded.

## Stories Included

- **001-weekly-quota-backend**: Aggregation from Monday 00:00, API endpoint, server-side rejection.
- **002-weekly-quota-ui-enforcement**: Live meter and modal warning.

## Bolt Type

**Type**: Simple Construction Bolt

## Stages

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → api/_db.js, api/quota.js, api/orders.js, index.html
- [ ] **3. Test**: Pending → test-walkthrough.md
