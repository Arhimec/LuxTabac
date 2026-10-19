---
intent: 001-order-persistence-and-history
phase: inception
status: complete
created: '2026-10-19T20:59:35Z'
updated: '2026-10-19T21:29:30Z'
---

# Requirements: Order Persistence & One-Click Rebuy (SQLite + Vercel)

## Intent Overview
Provide cross-border tobacco shoppers with an order history drawer, instant one-click rebuy capability, and EU 800-cigarette allowance tracking, backed by a local SQLite database served via lightweight Vercel serverless API routes (`/api/orders`) and deployed seamlessly to Vercel.

## Business Goals

| Goal | Success Metric | Priority |
|------|----------------|----------|
| One-Click Rebuy | Single tap restores prior cart directly into active checkout | Must |
| Local Database Persistence | Orders persisted to a local SQLite database instead of browser localStorage | Must |
| Vercel Deployment Ready | Project includes Vercel configuration (`vercel.json`) and serverless functions | Must |
| EU Allowance Compliance | Visual indicator highlights total volume against 800-cig personal transport threshold | Must |
| Mobile-First Drawer Experience | Flawless touch ergonomics and drawer navigation on mobile viewports | Must |

---

## Functional Requirements

### FR-1: Local SQLite Database & Serverless Order API
- **Description**: Provide a local SQLite database (`orders.db`) with schema and a lightweight Node/Vercel serverless endpoint (`/api/orders`) to persist and retrieve order records.
- **Acceptance Criteria**:
  - SQLite table schema: `orders` table storing `id`, `order_code` (unique), `customer_name`, `delivery_date`, `delivery_notes`, `items_json`, `grand_total`, `revolut_reference`, `total_cigs`, and `created_at`.
  - `POST /api/orders`: Validates payload, inserts order record, returns created order.
  - `GET /api/orders`: Retrieves recent orders ordered by `created_at DESC`.
  - Supports Vercel runtime environment (`/tmp` writable directory on serverless lambda, `./data` in local dev).
- **Priority**: Must
- **Related Stories**: TBD

### FR-2: Mobile-First Order History Slide-Over / Drawer
- **Description**: Add a responsive "History" button with badge indicator in the top navigation bar opening a mobile slide-over drawer that fetches past orders from `/api/orders`.
- **Acceptance Criteria**:
  - Drawer opens smoothly on both mobile viewports and desktop with backdrop blur.
  - Fetches and displays order entries: Order #, relative date, item summary (e.g. "2x Marlboro Red Carton"), total EUR amount, and status pill.
  - Handles loading and empty states cleanly with error recovery if API is unreachable.
  - Tapping an entry expands the full itemized breakdown and delivery note.
- **Priority**: Must
- **Related Stories**: TBD

### FR-3: Instant One-Click Rebuy
- **Description**: Each past order card in the history drawer contains a prominent "Rebuy This Basket" button.
- **Acceptance Criteria**:
  - Tapping "Rebuy" clears current active basket, re-populates it with the exact items and quantities from the historical order, closes the drawer, and scrolls to the order builder.
  - A toast notification confirms: `"Restored N items from order #LU-XXXX"`.
  - Recalculates EU 800-cigarette allowance indicator immediately.
- **Priority**: Must
- **Related Stories**: TBD

### FR-4: Cross-Border EU 800-Cigarette Volume Tracker
- **Description**: In the history drawer and active order view, calculate cumulative volume against the standard EU cross-border personal guideline (800 cigarettes / 4 cartons).
- **Acceptance Criteria**:
  - Clearly displays volume badge: `"Within 800-cig threshold"` (green) or `"Exceeds 800-cig standard limit"` (amber warning).
  - Converts rolling tobacco pots/buckets proportionally (1g $\approx$ 1 cigarette equivalent) to reflect accurate volumes.
- **Priority**: Must
- **Related Stories**: TBD

### FR-5: Export & Print Receipt Slip
- **Description**: Provide a "Receipt Slip" action on historical orders to view/copy a clean text invoice or trigger browser print preview.
- **Acceptance Criteria**:
  - Produces formatted receipt with order ID, date, items, total EUR, and Revolut reference note.
  - Formatted cleanly for mobile screens with copy-to-clipboard button.
- **Priority**: Should
- **Related Stories**: TBD

### FR-6: Vercel Deployment Configuration
- **Description**: Provide `vercel.json` and `package.json` configurations to ensure seamless build and deployment on Vercel.
- **Acceptance Criteria**:
  - `vercel.json` correctly routes `/api/*` to serverless function handlers and static assets to `/index.html` and public files.
  - `package.json` defines required scripts (`start`, `build`, etc.) and dependencies (`better-sqlite3` or SQLite driver).
- **Priority**: Must
- **Related Stories**: TBD

---

## Non-Functional Requirements

### Performance
| Requirement | Metric | Target |
|-------------|--------|--------|
| API Order Retrieval | Response latency | < 50ms |
| Drawer Open/Close Animation | Frame rate | 60 FPS on mobile |

### Mobile Ergonomics & Scalability
| Requirement | Standard | Target |
|-------------|----------|--------|
| Touch Target Size | Minimum button size | $\ge 44 \times 44$ px |
| Viewport Responsiveness | Screen widths supported | 320px to 4K |
| Safe Area Insets | iOS Home Bar & Notch | `env(safe-area-inset-bottom)` |

### Security & Privacy
| Requirement | Standard | Notes |
|-------------|----------|-------|
| Mandatory Sanitization | OWASP XSS Prevention | All historical order text strictly passed through `escapeHTML()` before rendering |
| Parameterized SQL | SQL Injection Prevention | All queries against SQLite use prepared statements |

---

## Constraints

### Technical Constraints
- Deployed on Vercel with Node.js serverless functions.
- Local SQLite database (file-based) rather than client-side `localStorage`.
- Maintain existing dark-mode gold/amber styling.

### Business & Legal Constraints
- Personal transport limits: Display advisory guidelines for EU cross-border allowance (800 cigarettes).
