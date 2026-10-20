# System Context: Intent 003 - Admin Control, Weekly Quota Governance & Catalog Expansion

## 1. System Context Diagram

```
+-----------------------------------------------------------------------------------+
|                                  LUXTABAC RESERVE                                 |
|                                                                                   |
|  +------------------+         +--------------------+         +-----------------+  |
|  |   Buyer Client   |         |    Admin Client    |         |  Revolut & WA   |  |
|  |  (index.html)    |         | (Admin Slide-over) |         |   Integration   |  |
|  +--------+---------+         +---------+----------+         +--------+--------+  |
|           |                             |                             |           |
|           +--------------+   +----------+                             |           |
|                          |   |                                        |           |
|                          v   v                                        |           |
|                 +------------------+                                  |           |
|                 | Serverless API   |<---------------------------------+           |
|                 | (/api/*)         |                                              |
|                 +--------+---------+                                              |
|                          |                                                        |
|                          v                                                        |
|                 +------------------+                                              |
|                 | SQLite Database  |                                              |
|                 | (luxtabac.db)    |                                              |
|                 | - orders         |                                              |
|                 | - app_settings   |                                              |
|                 | - custom_items   |                                              |
|                 | - coffee_promos  |                                              |
|                 +------------------+                                              |
+-----------------------------------------------------------------------------------+
```

## 2. Component Boundaries

1. **Buyer Experience (`index.html`)**:
   - Order builder with expanded catalog of Luxembourg manufactured cigarettes (no chopped/bucket tobacco).
   - Tip options: `No tip`, `Round Up (nearest 5€)`, `5% Tip (Round Down to 1€)`.
   - Name input with smart historical pre-filtering.
   - Weekly 800-cig quota meter with real-time feedback and blocking popup if weekly limit is exceeded.
   - Promotional coffee pods showcase rendered dynamically based on DB settings and admin visibility toggle.

2. **Backend API (`api/`)**:
   - `/api/orders`: Order placement with server-side weekly quota check.
   - `/api/quota`: Returns weekly cigarette consumption and Monday reset window.
   - `/api/settings`: Returns public settings (revtag, wa_link, coffee_visible) and handles admin updates.
   - `/api/custom-items`: Stores and retrieves user-added manual tobacco items.
   - `/api/coffee-promos`: Manages coffee showcase items.
   - `/api/admin/auth`: Session login / logout / validation.

3. **Database Schema (`api/_db.js`)**:
   - `orders`: existing table + indexed `created_at`.
   - `app_settings`: Key-value configuration (`revtag`, `whatsapp_link`, `coffee_promo_visible`, `admin_password_hash`).
   - `custom_items`: Buyer-submitted tobacco brands/models with price and admin approval status.
   - `coffee_promos`: Coffee roaster cards (brand, title, format, pack_qty, price, badge, active).
