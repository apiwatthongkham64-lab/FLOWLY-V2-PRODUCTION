# FLOWLY V1 Release Candidate

This candidate passed the final static release checks.

Confirmed:
- 22 API routes
- business isolation
- booking concurrency lock
- transaction rollback
- status transition protection
- duplicate-email handling
- HTTP-only session cookie
- core database tables
- Docker Compose PostgreSQL/API wiring
- start script
- backend syntax
- no `.env` bundled

Before live deployment:
1. Generate a real `package-lock.json` with npm on the deployment machine.
2. Run `npm ci`.
3. Start PostgreSQL/API via Docker Compose.
4. Run health + authentication + customer/service + booking + dashboard E2E tests.

This document does not claim live runtime success.
