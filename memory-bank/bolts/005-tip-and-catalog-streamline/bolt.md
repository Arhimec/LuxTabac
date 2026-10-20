---
id: 005-tip-and-catalog-streamline
unit: 001-tip-and-catalog-refinements
intent: 003-admin-control-and-quota-governance
type: simple-construction-bolt
status: completed
stories:
  - 001-tip-options-refactor
  - 002-luxembourg-cigarette-catalog
  - 003-buyer-name-prefiltering
created: '2026-10-20T19:47:00Z'
started: '2026-10-20T19:51:30Z'
completed: '2026-10-20T20:07:00Z'
current_stage: completed
stages_completed:
  - name: plan
    completed: '2026-10-20T19:51:37Z'
    artifact: implementation-plan.md
  - name: implement
    completed: '2026-10-20T20:02:00Z'
    artifact: implementation-walkthrough.md
  - name: test
    completed: '2026-10-20T20:06:00Z'
    artifact: test-walkthrough.md
requires_bolts:
  - 004-coffee-pods-showcase
enables_bolts:
  - 006-weekly-quota-governance
requires_units: []
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 005-tip-and-catalog-streamline

## Overview

Streamline tip buttons (single nearest 5€ round-up and whole 1€ rounded-down 5% tip), expand the Luxembourg catalog to all manufactured cigarette brands while removing all chopped/rolling/bucket tobacco, and implement buyer name history matching to pre-filter returning customer preferences.

## Objective

1. Replace dual round-up buttons with a single Round Up (to next 5 EUR) and round-down 5% tip.
2. Expand the cigarette catalog to cover all official Luxembourg brands without chopped tobacco.
3. Automatically suggest or pre-filter previously ordered cigarettes when typing buyer name.

## Stories Included

- **001-tip-options-refactor**: Single 5€ Round-up + integer-rounded 5% tip.
- **002-luxembourg-cigarette-catalog**: Full manufactured cigarette catalog (no chopped tobacco).
- **003-buyer-name-prefiltering**: Buyer name history pre-filtering.

## Bolt Type

**Type**: Simple Construction Bolt

## Stages

- [x] **1. Plan**: Completed → implementation-plan.md
- [x] **2. Implement**: Completed → implementation-walkthrough.md
- [x] **3. Test**: Completed → test-walkthrough.md
