# Implementation Walkthrough: Bolt 009 - Merchant Environment Parameters

## Changes Summary

### 1. Backend & Parameter Resolution (`api/_db.js`)
- Introduced `formatWhatsAppLink(rawNumberOrLink)`:
  - Sanitizes international phone numbers (e.g. `+352 691 123 456` $\rightarrow$ `https://wa.me/352691123456`).
  - Preserves full URLs (e.g. `https://chat.whatsapp.com/...`).
- Enhanced `getAllSettings()`:
  - Reads `REVOLUT_REVTAG` / `REVTAG` from `process.env`, automatically stripping leading `@`.
  - Reads `WHATSAPP_NUMBER` or `WHATSAPP_LINK` from `process.env`.
  - Reads `WERO_RECIPIENT` or `WERO_NUMBER` from `process.env`.
  - Falls back gracefully to SQLite `app_settings` table and baseline defaults if environment variables are unset.
  - Returns `envConfigured: { revtag: boolean, whatsapp: boolean, wero: boolean }` metadata indicating which fields are anchored via environment parameters.
- Exported `formatWhatsAppLink` for testing and reuse.

### 2. Settings API Endpoint (`api/settings.js`)
- Updated GET and PUT handlers to return `envConfigured` both at top-level and inside `settings`.

### 3. Admin Back-Office UI (`index.html`)
- Added discrete status badges in `#admin-panel-settings`:
  - `#env-badge-revtag`
  - `#env-badge-whatsapp`
  - `#env-badge-wero`
- Updated `loadAdminData()` and `loadPublicSettings()` to toggle visibility of badges based on `envConfigured` flags.

### 4. Repository Configuration Template (`.env.example`)
- Added comprehensive root `.env.example` file detailing:
  - `REVOLUT_REVTAG`
  - `WHATSAPP_NUMBER` / `WHATSAPP_LINK`
  - `WERO_RECIPIENT`
  - `ADMIN_USER`
  - `ADMIN_PASSWORD`
- Included setup instructions for GitHub Repository Variables & Secrets.
