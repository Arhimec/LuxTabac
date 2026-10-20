---
id: 007-admin-portal-and-backoffice
unit: 003-admin-auth-and-backoffice
intent: 003-admin-control-and-quota-governance
type: simple-construction-bolt
status: pending
stories:
  - 001-admin-auth-and-session
  - 002-admin-settings-management
  - 003-admin-coffee-and-custom-items
created: '2026-10-20T19:47:00Z'
started: null
completed: null
current_stage: null
stages_completed: []
requires_bolts:
  - 006-weekly-quota-governance
enables_bolts: []
requires_units: []
blocks: false
complexity:
  avg_complexity: 3
  avg_uncertainty: 1
  max_dependencies: 2
  testing_scope: 2
---

# Bolt: 007-admin-portal-and-backoffice

## Overview

Build the secure Admin portal: username/password authentication with session tokens, global settings control (Revolut Revtag, WhatsApp chat/group invite link, coffee visibility toggle), manual coffee showcase entries, and custom cigarette review/pricing adjustments.

## Objective

1. Provide an authentication dialog and session API (`/api/admin/login`, `/api/admin/logout`, `/api/admin/session`).
2. Provide back-office controls for Revtag, WhatsApp invite link, and coffee showcase visibility toggle.
3. Enable admin management of coffee items and manual buyer-submitted cigarette price adjustments.

## Stories Included

- **001-admin-auth-and-session**: Password authentication and session validation.
- **002-admin-settings-management**: Admin control of Revtag, WhatsApp link, and visibility toggle.
- **003-admin-coffee-and-custom-items**: Coffee showcase items CRUD and buyer custom cigarette entries.

## Bolt Type

**Type**: Simple Construction Bolt

## Stages

- [ ] **1. Plan**: Pending → implementation-plan.md
- [ ] **2. Implement**: Pending → api/_db.js, api/settings.js, api/admin.js, index.html
- [ ] **3. Test**: Pending → test-walkthrough.md
