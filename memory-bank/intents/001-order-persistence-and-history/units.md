# Units: 001-order-persistence-and-history

## Unit Decomposition Strategy
In accordance with `memory-bank/project.yaml` (`fullstack-app`), this feature is decomposed into two decoupled units:
1. **Backend Database & API** (`001-order-backend-sqlite`): SQLite schema, repository, serverless handler (`/api/orders`), and Vercel configuration.
2. **Frontend UI & Rebuy** (`002-order-history-ui`): Slide-over drawer, fetch API integration, 1-click rebuy, EU 800-cigarette tracker, and receipt export.

---

## Unit List

### Unit 001: `001-order-backend-sqlite`
- **Purpose**: Local SQLite database setup, schema migration, and Vercel serverless API handlers for order management.
- **Responsibility**: Database connection, table creation, parameterized queries (`POST /api/orders`, `GET /api/orders`), and `vercel.json` deployment configuration.
- **Assigned Requirements**: FR-1, FR-6
- **Unit Type**: `backend`
- **Default Bolt Type**: `simple-construction-bolt`
- **Dependencies**: None
- **Location**: `units/001-order-backend-sqlite/unit-brief.md`

### Unit 002: `002-order-history-ui`
- **Purpose**: Mobile slide-over history drawer, `/api/orders` client integration, one-click rebuy, and receipt export.
- **Responsibility**: Drawer DOM rendering, API communication, cart hydration, EU allowance tracker updates, and receipt slip formatting.
- **Assigned Requirements**: FR-2, FR-3, FR-4, FR-5
- **Unit Type**: `frontend`
- **Default Bolt Type**: `simple-construction-bolt`
- **Dependencies**: `001-order-backend-sqlite`
- **Location**: `units/002-order-history-ui/unit-brief.md`

---

## Requirement-to-Unit Mapping

- **FR-1** (Local SQLite DB & Serverless Order API) → `001-order-backend-sqlite`
- **FR-2** (Mobile History Drawer) → `002-order-history-ui`
- **FR-3** (Instant One-Click Rebuy) → `002-order-history-ui`
- **FR-4** (EU 800-Cigarette Allowance Tracker) → `002-order-history-ui`
- **FR-5** (Receipt Slip Export & Print) → `002-order-history-ui`
- **FR-6** (Vercel Deployment Configuration) → `001-order-backend-sqlite`
