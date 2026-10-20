# Implementation Walkthrough - Bolt 007: Admin Portal, Settings & Back-Office Suite

## Summary
Bolt 007 completes Unit `003-admin-auth-and-backoffice` of Intent `003-admin-control-and-quota-governance`. It delivers a secure, luxury back-office management console for store administrators to manage critical application settings, promotional coffee showcase items, and community-submitted custom cigarette pricing.

## Key Changes

### 1. Database & Security Foundation (`api/_db.js`)
- Added SQLite tables:
  - `app_settings (key TEXT PRIMARY KEY, value TEXT, updated_at DATETIME)`
  - `admin_sessions (token TEXT PRIMARY KEY, username TEXT, created_at DATETIME, expires_at DATETIME)`
  - `coffee_promos (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, title TEXT, qty TEXT, format TEXT, price REAL, badge TEXT, highlight TEXT, created_at DATETIME)`
  - `custom_items (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, pack_price REAL, carton_price REAL, created_by TEXT, created_at DATETIME)`
- Seeded default store settings (`revtag`: `'vladimtul'`, `whatsapp_link`: `'https://wa.me/'`, `coffee_visible`: `'1'`) and 4 initial coffee promo cards (Senseo, Lavazza, Dolce Gusto, Nespresso).
- Implemented cryptographic session management (`crypto.randomBytes(32)` tokens, 24-hour expiry, bearer authentication helper).
- Implemented administrative CRUD helpers:
  - `validateAdminCredentials(user, pass)`
  - `createAdminSession(username)` / `verifyAdminSession(token)` / `deleteAdminSession(token)`
  - `getAllSettings()` / `updateSettings({ revtag, whatsappLink, coffeeVisible })`
  - `getCoffeePromos()` / `addCoffeePromo(item)` / `deleteCoffeePromo(id)`
  - `getCustomItems()` / `addCustomItem(item)` / `updateCustomItemPrice(id, packPrice, cartonPrice)`

### 2. Serverless Handlers
- **`api/admin.js`**:
  - `POST /api/admin/login`: Verifies `admin` credentials (configurable via `ADMIN_USER` / `ADMIN_PASSWORD` env vars) and issues a session token.
  - `GET /api/admin/session`: Validates `Authorization: Bearer <token>` and returns auth status.
  - `POST /api/admin/logout`: Revokes active session token.
- **`api/settings.js`**:
  - `GET /api/settings`: Public endpoint returning `{ revtag, whatsappLink, coffeeVisible }`.
  - `PUT /api/settings`: Admin-authenticated endpoint to modify Revtag, WhatsApp link, and coffee visibility.
- **`api/coffee-promos.js`**:
  - `GET /api/coffee-promos`: Public endpoint returning active promotional coffee items.
  - `POST /api/coffee-promos`: Admin-authenticated endpoint to add new coffee items.
  - `DELETE /api/coffee-promos?id=<id>`: Admin-authenticated endpoint to remove coffee items.
- **`api/custom-items.js`**:
  - `GET /api/custom-items`: Public endpoint returning buyer/community submitted cigarettes.
  - `POST /api/custom-items`: Public endpoint adding a new custom cigarette entry to DB.
  - `PUT /api/custom-items`: Admin-authenticated endpoint to adjust pack & carton prices.
- **`api/orders.js`**:
  - Updated order insertion to auto-persist custom cigarette items into `custom_items` when a buyer places an order with a custom brand/model.

### 3. Server & Routing (`server.js`, `vercel.json`)
- Updated local dev server dispatcher and Vercel routing configuration to route `/api/admin`, `/api/settings`, `/api/coffee-promos`, and `/api/custom-items`.

### 4. Frontend UI & Back-Office Console (`index.html`)
- Replaced the buyer revtag popover with a dedicated Admin trigger button and pulse indicator in the header.
- Added `#admin-login-modal`: Clean, secure modal for admin sign-in.
- Added `#admin-backoffice-modal`: Multi-tab management console featuring:
  - **Tab 1: Global Settings**: Controls Revolut `@revtag`, WhatsApp courier chat URL, and a live toggle for the promotional coffee showcase.
  - **Tab 2: Coffee Showcase**: Displays all active coffee cards with brand, title, pack format, price, and delete actions, plus a collapsible "+ Add New Product" form.
  - **Tab 3: Custom Tobacco & Pricing**: Lists all custom brands/models entered by buyers with inline pack/carton price inputs and "Update Price" action.
- Dynamic Public Sync:
  - The public catalog dropdown dynamically ingests custom items under `<optgroup label="── ✨ Custom Community Cigarettes ──">` and maps them into `CATALOG_MAP`.
  - The promotional coffee section dynamically displays cards from `/api/coffee-promos` and toggles visibility based on `coffeeVisible`.
  - The Revolut QR code and WhatsApp sharing CTA dynamically use the admin-configured Revtag and WhatsApp chat link.

## Visual Verification Artifacts
- Admin Login Modal: `admin_login_modal_1792523533478.png`
- Global Settings Tab: `admin_global_settings_1792523593990.png`
- Coffee Showcase Tab: `admin_coffee_showcase_1792523624152.png`
- Custom Tobacco & Pricing Tab: `admin_custom_pricing_1792523652841.png`
- Public Store after Logout: `public_store_final_1792523748539.png`
- Video Session: `bolt_007_admin_verify_1792523511721.webp`
