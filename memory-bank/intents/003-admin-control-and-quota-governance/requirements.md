# Requirements: Intent 003 - Admin Control, Weekly Quota Governance & Catalog Expansion

## 1. Executive Summary

This intent elevates LuxTabac Reserve to an enterprise-grade border service platform by introducing:
1. **Streamlined Tip Calculation**: Single "Round Up (nearest 5€)" button and whole 1€ rounded-down 5% tip option.
2. **Global Weekly Quota Enforcement**: Strict 800-cigarette cross-border threshold aggregated across *all* buyer orders for the current calendar week (Monday 00:00 to Sunday 23:59:59), blocking submissions with a clear modal when exceeded.
3. **Comprehensive Luxembourg Cigarette Catalog**: Full market coverage of manufactured cigarettes (packs & cartons) without chopped/rolling/pot tobacco.
4. **Buyer Preference Auto-Detection**: Typing customer name auto-matches prior order history and pre-filters/suggests their preferred brand.
5. **Admin Back-Office & Authentication**: Secure username/password login modal with session management, enabling admin control over:
   - Promotional coffee entries (add, edit, delete, visibility toggle).
   - Dynamic manual cigarette items added by buyers (adjust price, activate).
   - Revolut Revtag (`@revtag`).
   - WhatsApp courier chat / group invite link.

---

## 2. Functional Requirements (FR)

### FR-1: Tipping UI & Math Streamlining
- **FR-1.1**: Tip selection options must be:
  - `No tip`: €0.00.
  - `Round Up`: Rounds the total up to the nearest multiple of 5 EUR (e.g. €77.00 ➔ €80.00 (+€3.00), €132.00 ➔ €135.00 (+€3.00); if exact multiple of 5, adds €5.00).
  - `5% Tip (Round Down)`: Calculates 5% of order subtotal, rounded **down** to the nearest whole integer in EUR (`Math.floor(subtotal * 0.05)`).
- **FR-1.2**: Tip value must update UI display, submit CTA, Step 2 summary, Revolut payment URL/QR code, and order database record.

### FR-2: Global Weekly 800-Cigarette Quota Governance
- **FR-2.1**: The system must track the aggregate sum of `total_cigs` of all orders placed in the current week starting Monday at 00:00:00 local time.
- **FR-2.2**: An API endpoint `GET /api/quota` must return `{ weeklyLimit: 800, currentUsed: X, remaining: 800 - X, resetDate: "YYYY-MM-DD 00:00" }`.
- **FR-2.3**: If a buyer attempts to submit an order where `currentUsed + order.totalCigs > 800`:
  - The server must reject the order with HTTP 400 (`WEEKLY_QUOTA_EXCEEDED`).
  - The client UI must display an informative alert modal stating the week's courier threshold has been filled and resets next Monday.
- **FR-2.4**: The header/builder must display a live progress status (e.g. `Weekly Courier Capacity: 600/800 cigs booked (200 remaining)`).

### FR-3: Luxembourg Manufactured Cigarette Catalog Expansion
- **FR-3.1**: Include all major manufactured cigarette brands in Luxembourg: Marlboro, Camel, Lucky Strike, Winston, Gauloises, Chesterfield, Philip Morris, Dunhill, Kent, Vogue, Davidoff, Benson & Hedges, Pall Mall, JPS, Fortuna, News, Ducados, L&M, Peter Stuyvesant.
- **FR-3.2**: Strictly exclude chopped, volume, pipe, or rolling/tubing tobacco.
- **FR-3.3**: Allow buyers to submit a manual item if missing; manual items are saved to the database and appended to the catalog for subsequent buyers with a flag `pending_price_review`.

### FR-4: Buyer Name History Pre-filtering
- **FR-4.1**: When a buyer inputs their name into `#customer-name`, the system checks local history (or backend history) for recent matches.
- **FR-4.2**: If a previous order is found for that name, the builder displays a quick chip (e.g., `⚡ Reorder your usual: Marlboro Red (Carton)`) allowing 1-click selection and filters the brand dropdown.

### FR-5: Admin Authentication & Back-Office
- **FR-5.1**: Secure login dialog accessed via header/footer admin key trigger.
- **FR-5.2**: Authentication validated via `/api/admin/login` using credentials (username + bcrypt-hashed password or secure auth token stored in HttpOnly cookie or secure session token).
- **FR-5.3**: Admin Settings Management:
  - Update Revolut Revtag (`@revtag`).
  - Update WhatsApp link (`https://chat.whatsapp.com/...` or `https://wa.me/...`).
  - Toggle promotional coffee section visibility (`true`/`false`).
- **FR-5.4**: Admin Coffee Products Management:
  - View, Add, Edit, Delete coffee items (brand, title, format, pack quantity, price, badge, highlight).
- **FR-5.5**: Admin Custom Cigarette Price Adjuster:
  - View buyer-submitted manual cigarette entries and set official pack/carton prices.

---

## 3. Non-Functional Requirements (NFR)

- **NFR-1 (Security)**: Admin routes (`/api/admin/*`) must enforce authenticated session verification. Passwords must never be stored in plain text.
- **NFR-2 (Performance)**: Quota calculation must use indexed queries on `orders(created_at)` ensuring <10ms API response.
- **NFR-3 (UX Consistency)**: Admin modal and back-office panel must match the luxury obsidian and gold glassmorphic design system.
- **NFR-4 (Resilience)**: Monday 00:00 quota reset is calculated algorithmically from timestamp, requiring no cron job or external daemon.
