---
stage: plan
bolt: 002-order-history-ui
created: 2026-10-19T21:43:25Z
---

## Implementation Plan: 002-order-history-ui

### Objective
Implement the client-side user experience in `index.html` connecting to `/api/orders`: a mobile-first slide-over history drawer, automated order persistence to the SQLite API upon checkout, 1-click rebuy cart restoration, EU 800-cigarette allowance tracking, and receipt slip view/printing.

### Deliverables
1. **Header History Trigger**:
   - Add `#btn-open-history` in top navigation bar with history icon and dynamic count badge.
2. **Slide-Over History Drawer Component**:
   - Backdrop overlay (`#history-drawer-backdrop`) with blur and touch dismiss.
   - Slide-over panel (`#history-drawer-panel`) styled with Tailwind CSS dark-mode aesthetics (zinc-900/950, amber accents, smooth 60 FPS transitions).
   - Dynamic states: loading skeleton, empty state with action link, and populated list of order cards.
   - Expandable order cards showing order date, item breakdown, Revolut note, and total.
3. **One-Click Rebuy Mechanism**:
   - "Rebuy This Basket" button on each historical order card.
   - Restores items directly into `multiOrderItems` or active builder item.
   - Closes drawer, smoothly scrolls to order builder, and displays toast notification.
4. **EU 800-Cigarette Allowance Tracker**:
   - Calculates total cigarettes across active basket / historical orders (carton = 200 cigs, rolling tobacco = 1g/cig eq).
   - Visual status pill: `"Within EU Limit (<800 cigs)"` (emerald) vs `"Exceeds EU 800-Cig Guideline"` (amber).
5. **Receipt Slip & Print View**:
   - Modal displaying clean text invoice with itemized pricing, tax notes, and payment status.
   - Copy-to-clipboard action and browser print stylesheet.
6. **API Integration**:
   - Automatically posts confirmed orders to `POST /api/orders` when generating the payment QR.
   - Fetches historical orders from `GET /api/orders` on drawer open and initial page load.

### Dependencies
- `/api/orders` backend endpoints provided by `001-order-backend-sqlite`.

### Technical Approach
- Zero external client frameworks: Pure vanilla JS with responsive Tailwind CSS.
- OWASP XSS prevention: Every dynamic text node from API responses passed through existing `escapeHTML()`.
- Responsive touch targets: All buttons $\ge 44 \times 44$ px for optimal mobile ergonomics.

### Acceptance Criteria
- [ ] History button in header toggles slide-over drawer smoothly
- [ ] Orders confirmed in checkout are persisted to `/api/orders`
- [ ] Drawer loads orders from SQLite API and renders itemized history
- [ ] Tapping "Rebuy" repopulates the basket and prompts user
- [ ] EU 800-cigarette volume badge reflects accurate carton/weight calculations
- [ ] Receipt slip displays cleanly and copies/prints accurately
