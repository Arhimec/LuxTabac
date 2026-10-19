# Coding Standards

## Overview
Defensive, security-conscious coding standards tailored for a client-side JavaScript single-page application. Emphasizes mandatory DOM sanitization, semantic markup, and reliable defensive programming.

## Code Formatting

- **Indentation**: 4 spaces per indentation level.
- **Quotes**: Single quotes `'` for JavaScript strings; double quotes `"` for HTML attributes and JSON.
- **Semicolons**: Explicit semicolons required on all statements.
- **Line Length**: Max 120 characters soft limit.

## DOM Safety & Sanitization

- **Mandatory HTML Escaping**: Any dynamic or user-controlled text injected via `innerHTML` or template literals MUST be passed through `escapeHTML()`.
- **Text Injection**: Prefer `element.textContent` over `element.innerHTML` whenever raw text without markup is rendered.
- **Attribute Safety**: Never interpolate unescaped user strings directly into HTML tag attributes or inline event handlers.

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables & State | camelCase | `orderBasket`, `merchantRevtag` |
| Functions & Helpers | camelCase (verb-first) | `getCurrentConfiguredItem`, `escapeHTML` |
| DOM Element Constants | camelCase (descriptive suffix) | `btnAgeConfirm`, `explorerSearch`, `basketItemsContainer` |
| Constants & Catalogs | UPPER_SNAKE_CASE | `LU_2026_CATALOG`, `CATALOG_MAP` |
| CSS Classes | kebab-case (Tailwind utilities) | `bg-zinc-900`, `text-amber-400` |
| IDs in HTML | kebab-case | `customer-name`, `price-explorer-modal` |

## File & Code Organization

- **Self-Contained Modularity**: Keep related styles, views, and controller functions organized in logical sections with clear banner comments:
  - 1. Catalog & Data Definitions
  - 2. Application State
  - 3. DOM Element Selectors
  - 4. View Rendering & UI Updates
  - 5. Calculations & Allowance Validation
  - 6. QR Generation & Sharing
  - 7. Event Listeners
  - 8. Initialization & Compliance Gates
- **Vendors**: Third-party standalone libraries (e.g., `qrcode.min.js`) are kept locally in the project root to guarantee offline reliability.

## Testing & Quality Strategy

- **Browser & Unit Validation**: Syntax validation via Node.js / Playwright E2E browser checks.
- **Sanitization Audits**: Verify zero injection vulnerabilities before any release.
- **Edge-Case Validation**: Always validate and clamp numeric inputs (quantities $\in [1, 100]$, prices $\ge 0$).

## Error Handling

- **Defensive Fallbacks**: Provide immediate, non-intrusive UI error banners (`#form-error`, `#toast-banner`) instead of silent failures.
- **Guard Clauses**: Check conditions early (e.g. `if (!name || !deliveryDate) return;`).
- **Clipboard Fallback**: Support modern `navigator.clipboard.writeText` with legacy `document.execCommand` fallback.
