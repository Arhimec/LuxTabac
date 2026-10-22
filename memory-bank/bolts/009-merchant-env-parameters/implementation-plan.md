# Implementation Plan: Bolt 009 - Merchant Environment Parameters

## 1. Technical Design

### A. Environment Variable Resolution Hierarchy (`api/_db.js`)
Update `getAllSettings()` to resolve parameters with the following precedence:
1. **Revtag**:
   `process.env.REVOLUT_REVTAG || process.env.REVTAG || map.revtag || 'vladimtul'`
2. **WhatsApp**:
   - If `process.env.WHATSAPP_NUMBER`: clean all non-digit characters (e.g. `+352 691 123 456` -> `352691123456`) and return `https://wa.me/352691123456`.
   - Else `process.env.WHATSAPP_LINK || map.whatsapp_link || 'https://wa.me/'`.
3. **Wero Recipient**:
   `process.env.WERO_RECIPIENT || process.env.WERO_NUMBER || map.wero_recipient || '+352 691 000 000'`.
4. **Env Status Indicators**:
   Provide `envConfigured: { revtag: boolean, whatsapp: boolean, wero: boolean }` so consumers know if a value is anchored by environment variables.

### B. Settings API Endpoint (`api/settings.js`)
- Return `envConfigured` alongside `settings` in GET and PUT responses.
- In PUT requests, allow admin updates to save to SQLite (which act as durable fallbacks if env vars are unset).

### C. Admin UI Badging (`index.html`)
- In `#admin-panel-settings`, inspect `data.envConfigured`.
- Display a small badge `🔒 GitHub / Env` next to Revtag, WhatsApp, and Wero recipient labels if configured via environment variables.

### D. Documentation (`.env.example`)
Create `.env.example` documenting:
- `REVOLUT_REVTAG`
- `WHATSAPP_NUMBER`
- `WERO_RECIPIENT`
- `ADMIN_USER`
- `ADMIN_PASSWORD`

### E. Test Suite (`tests/bolt-009.test.js`)
- Test Revtag resolution from `REVOLUT_REVTAG` and `REVTAG`.
- Test WhatsApp formatting from `WHATSAPP_NUMBER` and `WHATSAPP_LINK`.
- Test Wero recipient resolution from `WERO_RECIPIENT` and `WERO_NUMBER`.
- Test fallback to SQLite `app_settings` when env vars are deleted/undefined.
- Test `/api/settings` response payload containing `envConfigured`.
- Verify DOM badges in `index.html`.
