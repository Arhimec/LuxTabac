# Story: 001-admin-auth-and-session

## Metadata
- **Unit**: 003-admin-auth-and-backoffice
- **Intent**: 003-admin-control-and-quota-governance
- **Priority**: Must Have
- **Status**: Planned

## Description
Provide secure username and password authentication for administrative access, protecting back-office management routes and APIs.

## Acceptance Criteria
1. The app header / footer contains a discreet "Admin Portal" trigger.
2. Clicking Admin Portal opens a luxury authentication modal requesting Username and Password.
3. Backend route `POST /api/admin/login`:
   - Validates username and password against credentials configured in environment variables or database hash.
   - Default initial credentials configurable via env (`ADMIN_USER`, `ADMIN_PASSWORD`).
   - Issues a secure cryptographically signed session token (or HMAC session cookie).
4. `GET /api/admin/session` validates active session.
5. `POST /api/admin/logout` invalidates session.
6. Unauthorized access attempts to administrative endpoints return HTTP 401 Unauthorized.
