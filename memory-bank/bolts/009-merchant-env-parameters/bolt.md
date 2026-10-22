---
id: 009-merchant-env-parameters
unit: 001-env-parameter-governance
intent: 005-persistent-environment-configuration
type: simple-construction-bolt
status: completed
stories:
  - 001-merchant-env-parameters
created: '2026-10-22T20:51:00Z'
started: '2026-10-22T20:52:00Z'
completed: '2026-10-22T20:55:00Z'
current_stage: completed
stages_completed:
  - name: plan
    completed: '2026-10-22T20:51:00Z'
    artifact: implementation-plan.md
  - name: implement
    completed: '2026-10-22T20:54:00Z'
    artifact: implementation-walkthrough.md
  - name: test
    completed: '2026-10-22T20:55:00Z'
    artifact: test-walkthrough.md
requires_bolts:
  - 007-admin-portal-and-backoffice
  - 008-wero-qr-payment-integration
enables_bolts: []
requires_units: []
blocks: false
complexity:
  avg_complexity: 1
  avg_uncertainty: 1
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 009-merchant-env-parameters

## Overview
Implement persistent and durable merchant parameters (Revolut Revtag, WhatsApp number/link, Wero recipient handle) via GitHub repository environment variables and `process.env`, preserving configuration across deployments and serverless cold starts.

## Objective
1. Enhance `getAllSettings()` to prioritize `REVOLUT_REVTAG` / `REVTAG`, `WHATSAPP_NUMBER` / `WHATSAPP_LINK`, and `WERO_RECIPIENT` / `WERO_NUMBER`.
2. Format `WHATSAPP_NUMBER` into valid `https://wa.me/` direct chat URLs.
3. Expose environment configuration status in `/api/settings` and render `🔒 GitHub Env` badges in the Admin Settings panel.
4. Provide `.env.example` in repository root for GitHub Actions / GitHub Repository Variables configuration.
5. Create comprehensive automated tests verifying environment variable precedence, phone sanitization, and fallback.

## Stories Included
- **001-merchant-env-parameters**: Consistent merchant parameters via environment variables.

## Stages
- [x] **1. Plan**: Completed → implementation-plan.md
- [x] **2. Implement**: Completed → implementation-walkthrough.md
- [x] **3. Test**: Completed → test-walkthrough.md
