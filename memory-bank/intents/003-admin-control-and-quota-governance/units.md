# Units of Delivery: Intent 003

## Unit Decomposition

This intent is decomposed into 3 decoupled units:

### Unit 001: 001-tip-and-catalog-refinements
- **Purpose**: Refine tipping buttons to single 5€ Round-up and integer-rounded 5% tip, expand the catalog to all official Luxembourg manufactured cigarettes (excluding rolling/chopped tobacco), and add buyer name history matching.
- **Stories**:
  - `001-tip-options-refactor`: Refactor tip buttons to `No tip`, `Round Up (5€)`, `5% (Round Down to 1€)`.
  - `002-luxembourg-cigarette-catalog`: Comprehensive catalog covering all manufactured cigarette brands and formats.
  - `003-buyer-name-prefiltering`: Smart previous-brand suggestion upon entering buyer name.

### Unit 002: 002-weekly-quota-governance
- **Purpose**: Strictly enforce an 800-cigarette quota across all orders in the current calendar week (Monday 00:00 to Sunday 23:59:59).
- **Stories**:
  - `001-weekly-quota-backend`: SQLite date-range aggregation from Monday 00:00, API endpoint `/api/quota`, server-side validation.
  - `002-weekly-quota-ui-enforcement`: Progress capacity indicator and quota-exceeded warning modal.

### Unit 003: 003-admin-auth-and-backoffice
- **Purpose**: Admin login authentication, settings management (Revtag, WhatsApp invite link, coffee visibility toggle), manual item approval, and coffee items CRUD.
- **Stories**:
  - `001-admin-auth-and-session`: Password-protected admin authentication with secure session token.
  - `002-admin-settings-management`: Admin panel for Revtag, WhatsApp link, and coffee visibility toggle.
  - `003-admin-coffee-and-custom-items`: Admin management of coffee showcase cards and buyer custom cigarette entries.
