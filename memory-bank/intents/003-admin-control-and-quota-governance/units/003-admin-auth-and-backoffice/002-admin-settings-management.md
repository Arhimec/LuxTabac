# Story: 002-admin-settings-management

## Metadata
- **Unit**: 003-admin-auth-and-backoffice
- **Intent**: 003-admin-control-and-quota-governance
- **Priority**: Must Have
- **Status**: Planned

## Description
Provide administrative control over global store settings: Revolut `@revtag`, WhatsApp courier chat/group invite link, and the Coffee Showcase visibility toggle.

## Acceptance Criteria
1. The Admin back-office displays a "Global Settings" tab with:
   - **Revolut Revtag**: Editable text input (e.g. `vladimtul`), replacing all client-side prompt popups.
   - **WhatsApp Link**: Editable URL input for WhatsApp direct link or group invite link (e.g. `https://chat.whatsapp.com/XYZ` or `https://wa.me/352...`).
   - **Coffee Showcase Visibility**: Toggle switch (`Visible` / `Hidden`).
2. Saving changes persists them into the `app_settings` SQLite table.
3. The public client automatically consumes these settings:
   - Revolut link and QR code generate using the admin's Revtag.
   - WhatsApp CTA redirects to the admin's configured WhatsApp link.
   - The Coffee Pods section is hidden if toggled off, or visible if toggled on.
