# Implementation Plan: Bolt 007 - Admin Portal & Back-Office

## 1. Goal
Implement administrative authentication and complete back-office controls for LuxTabac Reserve:
1. **001-admin-auth-and-session**:
   - SQLite schema for `admin_sessions`.
   - Serverless endpoint `/api/admin` handling `login`, `session`, `logout`.
   - Credentials configured via env (`ADMIN_USER || 'admin'`, `ADMIN_PASSWORD || 'luxtabac2026!'`).
   - Secure cryptographic token generated on login, stored in SQLite `admin_sessions`.
   - Admin authentication middleware/helper `verifyAdminSession(req)` in `api/_db.js`.

2. **002-admin-settings-management**:
   - SQLite schema for `app_settings` (`key TEXT PRIMARY KEY, value TEXT`).
   - Default settings seeded:
     - `revtag`: `vladimtul`
     - `whatsapp_link`: `https://wa.me/`
     - `coffee_visible`: `1`
   - Serverless endpoint `/api/settings`:
     - `GET`: Public read of safe configuration settings.
     - `POST` / `PUT`: Admin-only update of settings.
   - Frontend integration:
     - Dynamic merchant Revtag in Revolut QR and links (removing client popups).
     - Dynamic WhatsApp courier group/direct chat link.
     - Dynamic display/hide of `#coffee-pods-showcase`.

3. **003-admin-coffee-and-custom-items**:
   - SQLite schema for `coffee_promos`:
     - Initial coffee items seeded (Lavazza, Nespresso, Senseo, Dolce Gusto).
     - Serverless endpoint `/api/coffee-promos`:
       - `GET`: Public read.
       - `POST`: Admin create.
       - `DELETE`: Admin delete.
   - SQLite schema for `custom_items`:
     - Automatic insertion when a buyer enters a manual custom brand/model.
     - Serverless endpoint `/api/custom-items`:
       - `GET`: Public read to populate dropdown alongside official catalog.
       - `PUT` / `PATCH`: Admin update of pack and carton prices.
   - Front-end back-office UI:
     - Header/Footer discreet "Admin Portal" trigger.
     - Admin login modal.
     - Luxury Admin Back-Office slide-over with tabs:
       - Tab 1: Global Store Settings.
       - Tab 2: Coffee Showcase Management (Add/Delete/View).
       - Tab 3: Custom Cigarette Items & Pricing Adjustments.

## 2. Testing Strategy
- Unit & integration tests in `tests/bolt-007.test.js`:
  - Authentication flow (login, token validation, wrong password rejection, logout).
  - Settings retrieval and admin updates.
  - Coffee promos CRUD and access control.
  - Custom items creation, listing in catalog, and admin price adjustment.
  - Unauthenticated mutation rejections (HTTP 401).
- Browser visual verification via `browser_subagent`.
- Run complete test suite (`npm test`).
