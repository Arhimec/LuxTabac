# Story: 001-admin-wero-settings

## Story Metadata
- **ID**: `001-admin-wero-settings`
- **Unit**: `001-wero-payment-integration`
- **Intent**: `004-wero-qr-payment-method`
- **Priority**: Must
- **Status**: Planned

## Description
As a store administrator,
I want to configure the store's Wero recipient handle, phone number, or payment link in the Back-Office Global Settings,
So that buyers are presented with the correct payment destination when transferring funds via Wero.

## Acceptance Criteria
1. `api/_db.js`:
   - `app_settings` includes default key `wero_recipient` (`+352 691 000 000` or custom default).
   - `getAllSettings()` returns `weroRecipient`.
   - `updateSettings()` accepts and updates `weroRecipient`.
2. `api/settings.js`:
   - `GET /api/settings` includes `weroRecipient` in public response.
   - `PUT /api/settings` accepts `weroRecipient` under Bearer token authorization and returns updated settings.
3. `index.html`:
   - Back-Office modal ("Global Settings" tab) contains input `#admin-setting-wero` with label "Wero Recipient (Phone / Handle / Link)".
   - Clicking "Save Global Settings" saves `weroRecipient` and displays confirmation toast.
