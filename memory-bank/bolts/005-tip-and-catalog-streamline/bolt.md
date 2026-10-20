---
id: 005-tip-and-catalog-streamline
unit: 001-tip-and-catalog-refinements
intent: 003-admin-control-and-quota-governance
type: simple-construction-bolt
status: pending
stories:
  - 001-tip-options-refactor
  - 002-luxembourg-cigarette-catalog
  - 003-buyer-name-prefiltering
created: '2026-10-20T19:47:00Z'
started: null
completed: null
current_stage: null
stages_completed: []
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

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → index.html
- [ ] **3. Test**: Pending → test-walkthrough.md
