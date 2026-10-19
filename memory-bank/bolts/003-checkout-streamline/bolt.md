---
id: 003-checkout-streamline
unit: 001-checkout-streamline-and-navigation
intent: 002-checkout-refinement-and-promotions
type: simple-construction-bolt
status: completed
stories:
  - 001-remove-logistics-fields
  - 002-home-navigation-reset
  - 003-interactive-tip-chips
created: '2026-10-19T23:17:50Z'
started: '2026-10-19T23:19:20Z'
completed: '2026-10-19T23:42:00Z'
current_stage: completed
stages_completed:
  - name: plan
    completed: '2026-10-19T23:19:20Z'
    artifact: implementation-plan.md
  - name: implement
    completed: '2026-10-19T23:25:00Z'
    artifact: implementation-walkthrough.md
  - name: test
    completed: '2026-10-19T23:41:00Z'
    artifact: test-walkthrough.md
requires_bolts:
  - 002-order-history-ui
enables_bolts:
  - 004-coffee-pods-showcase
requires_units: []
blocks: false
complexity:
  avg_complexity: 2
  avg_uncertainty: 1
  max_dependencies: 1
  testing_scope: 2
---

# Bolt: 003-checkout-streamline

## Overview

Streamline the customer checkout experience by removing delivery date and notes, adding interactive Home/Reset navigation in the header, and adding selectable tip chips (`[No tip]`, `[Round to 5€]`, `[Round to 10€]`, `[5%]`) that calculate live into the grand total, Revolut payment URL, QR code, and receipt.

## Objective

1. Remove delivery date and notes inputs and requirements from UI and API validation.
2. Add Home / Reset trigger on the header logo/brand.
3. Add tip selector chips in Step 1 with real-time DOM reactivity.
4. Update Revolut URL and QR generation to include tip amount.

## Stories Included

- **001-remove-logistics-fields**: Clean up form fields, backend schema, and validation.
- **002-home-navigation-reset**: Header logo/home reset without re-prompting 18+ modal.
- **003-interactive-tip-chips**: Interactive tip chips with real-time recalculation of total, QR, and receipt.

## Bolt Type

**Type**: Simple Construction Bolt

## Stages

- [x] **1. Plan**: Completed → implementation-plan.md
- [x] **2. Implement**: Completed → implementation-walkthrough.md
- [x] **3. Test**: Completed → test-walkthrough.md
