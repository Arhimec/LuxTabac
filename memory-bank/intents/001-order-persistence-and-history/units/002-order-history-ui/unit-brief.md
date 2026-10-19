---
unit: 002-order-history-ui
intent: 001-order-persistence-and-history
phase: inception
status: complete
created: '2026-10-19T21:23:50Z'
updated: '2026-10-19T21:40:00Z'
---

# Unit Brief: 002-order-history-ui

## Purpose
Provide a mobile-first slide-over history drawer in the frontend connecting to `/api/orders` for viewing past orders, one-click cart restoration, EU 800-cigarette allowance monitoring, and receipt slip exporting.

## Scope
- Navigation "History" button with badge indicator.
- Slide-over drawer with backdrop blur, smooth 60 FPS CSS transitions, and touch target accessibility ($\ge 44 \times 44\text{px}$).
- API client functions to fetch past orders and submit new orders via `fetch('/api/orders')`.
- One-click "Rebuy" handler restoring items into active basket.
- Real-time EU 800-cigarette volume calculation and warning banner.
- Formatted receipt view with clipboard copy and print stylesheet.

## Key UI Components
- `History Drawer`: Slide-over drawer with order list, item breakdown, and delivery details.
- `Rebuy Button`: Immediate basket hydration and drawer dismiss.
- `Allowance Badge`: Green / Amber cross-border EU limit indicator.
- `Receipt View`: Printable invoice format.

## Success Criteria
- [ ] Drawer smoothly opens and closes on desktop and mobile viewports
- [ ] Past orders render with proper sanitization (`escapeHTML()`)
- [ ] 1-Click rebuy populates shopping basket accurately
- [ ] EU 800-cigarette volume tracker recalculates correctly
- [ ] Receipt slips copy cleanly to clipboard
