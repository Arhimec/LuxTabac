# Story: 002-payment-method-selector-tabs

## Story Metadata
- **ID**: `002-payment-method-selector-tabs`
- **Unit**: `001-wero-payment-integration`
- **Intent**: `004-wero-qr-payment-method`
- **Priority**: Must
- **Status**: Completed

## Description
As a buyer on Step 2 (Payment Screen),
I want to toggle easily between Revolut and Wero payment methods via intuitive tabs,
So that I can pay using my preferred mobile payment app without recalculation errors or loss of order reference.

## Acceptance Criteria
1. `index.html`:
   - Header step 2 badge updated to reflect multi-method payment ("2. Payment").
   - Payment view (`#payment-view`) contains payment method switch tabs:
     - `#tab-payment-revolut`: With Revolut branding and active state indicator.
     - `#tab-payment-wero`: With Wero branding (European instant pay) and active state indicator.
2. Client-side Interaction:
   - Selecting a tab activates the corresponding method without reloading or resetting order state.
   - Preserves total payable amount (including selected tip) and unique Revolut/Wero reference code.
   - Dynamic instructional text updates based on the selected method.
3. Mobile Responsiveness:
   - Selector tabs are touch-friendly, high-contrast, and visually prominent on mobile and desktop viewports.
