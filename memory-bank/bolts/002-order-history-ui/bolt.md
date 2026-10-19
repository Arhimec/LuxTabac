---
id: 002-order-history-ui
unit: 002-order-history-ui
intent: 001-order-persistence-and-history
type: simple-construction-bolt
status: complete
stories:
  - 004-order-history-drawer-ui
  - 005-one-click-rebuy
  - 006-eu-allowance-and-receipt
created: '2026-10-19T21:25:20Z'
started: '2026-10-19T21:42:45Z'
completed: '2026-10-19T19:54:48Z'
current_stage: null
stages_completed:
  - name: plan
    completed: '2026-10-19T21:46:10Z'
    artifact: implementation-plan.md
  - name: implement
    completed: '2026-10-19T21:52:20Z'
    artifact: implementation-walkthrough.md
requires_bolts:
  - 001-order-backend-sqlite
enables_bolts: []
requires_units:
  - 001-order-backend-sqlite
blocks: false
complexity:
  avg_complexity: 1
  avg_uncertainty: 1
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 002-order-history-ui

## Overview

Client-side user interface connecting to `/api/orders` for order history browsing, 1-click rebuy cart restoration, EU 800-cigarette allowance tracking, and receipt slip exporting.

## Objective

Implement the mobile-first slide-over history drawer, integrate `/api/orders` API calls (replacing localStorage), build one-click rebuy basket restoration, EU cross-border volume tracker, and exportable receipt slip.

## Stories Included

- **004-order-history-drawer-ui**: Mobile-first slide-over history drawer in navigation bar (Must)
- **005-one-click-rebuy**: Restore prior order items into active checkout basket (Must)
- **006-eu-allowance-and-receipt**: EU 800-cig cross-border allowance tracker and receipt slip (Should)

## Bolt Type

**Type**: Simple Construction Bolt
**Definition**: `.specsmd/aidlc/templates/construction/bolt-types/simple-construction-bolt.md`

## Stages

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → index.html + implementation-walkthrough.md
- [ ] **3. Test**: Pending → test-walkthrough.md

## Dependencies

### Requires
- 001-order-backend-sqlite (`/api/orders` endpoints must be ready)

### Enables
- None (final frontend feature unit)

## Success Criteria

- [ ] All 3 frontend stories implemented
- [ ] Drawer opens smoothly at 60 FPS on mobile and desktop
- [ ] Orders loaded asynchronously from `/api/orders`
- [ ] 1-Click rebuy populates shopping basket accurately
- [ ] EU 800-cigarette volume tracker displays correct compliance badges
- [ ] Zero unescaped HTML injections (`escapeHTML()` strictly enforced)
