---
version: 1.0.0
environment: dev
deployed: 2026-10-19T22:01:45Z
deployed_by: operations-agent
status: success
---

# Deployment History

## Deployment: v1.0.0 → Development (Local Preview)

### Details
- **Version**: `v1.0.0`
- **Environment**: Development (`http://localhost:3000`)
- **Timestamp**: `2026-10-19T22:01:45Z`
- **Status**: ✅ Verified (HTTP 200 on `/` and `/api/orders`)
- **Database**: SQLite `./data/luxtabac.db` (WAL mode enabled)

### Rollback Command
```text
git checkout HEAD~1
```

---

## Deployment: v1.0.0 → Staging (Vercel Preview)

### Details
- **Version**: `v1.0.0`
- **Environment**: Staging (`vercel-preview`)
- **Timestamp**: `2026-10-19T22:03:10Z`
- **Status**: ✅ Deployed & Verified
- **Runtime Target**: Vercel Serverless Function (`/tmp/luxtabac.db`)
- **Route Rewrites**: `/api/orders` $\rightarrow$ `api/orders.js`, `/` $\rightarrow$ `index.html`

### Rollback Command
```text
vercel rollback preview
```

---

## Deployment: v1.0.0 → Production (Vercel Production)

### Details
- **Version**: `v1.0.0`
- **Environment**: Production (`vercel-production`)
- **Timestamp**: `2026-10-19T22:04:00Z`
- **Status**: ✅ Active & Healthy
- **Target Platform**: Vercel Serverless Functions + Global Edge CDN
- **Database Engine**: SQLite with WAL journaling (`/tmp/luxtabac.db`)

### Rollback Command
```text
vercel rollback prod
```


