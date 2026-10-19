---
id: 004-order-history-drawer-ui
unit: 002-order-history-ui
intent: 001-order-persistence-and-history
priority: Must
status: complete
created: '2026-10-19T21:24:30Z'
implemented: true
---

# Story: Mobile Order History Drawer UI

## As a
Cross-Border Shopper

## I want
A slide-over history drawer in the navigation bar that loads my past orders from `/api/orders`

## So that
I can review past purchases, delivery dates, and carton details directly on my mobile phone.

## Acceptance Criteria
- [ ] History button with count badge in top navigation bar opens the drawer
- [ ] Drawer has backdrop blur, smooth slide-in transition, and swipe/tap-away dismiss
- [ ] Calls `fetch('/api/orders')` on open and renders loading spinner / skeleton
- [ ] Safely displays each order card: Order code, relative date, item summary, EUR total, status pill
- [ ] Tapping an order card expands full itemized breakdown with carton/pot counts
- [ ] All dynamic strings pass through `escapeHTML()` to prevent XSS
- [ ] Empty state with "No previous orders found" message and "Start Browsing" action
