# FLOWLY V1 — E2E Runbook

Run only after PostgreSQL + API are actually started.

1. Health: GET `/api/v1/health` → 200.
2. Register a unique test account → 201/200.
3. Login → session cookie set.
4. `/api/v1/me` → current user returned; no password hash.
5. Create customer → retrieve/update/delete within same business.
6. Create service → verify active service.
7. Create booking → verify conflict protection with a duplicate time slot.
8. Update booking status → verify allowed transition and invalid transition rejection.
9. Dashboard summary/revenue/today → verify responses contain the created test data.
10. Logout → session invalidated; protected endpoint returns 401.
11. Attempt cross-business resource access → must not expose another business's data.
12. Restart containers → PostgreSQL data remains and API becomes healthy again.

Record HTTP status and response body for every step.
Do not use real customer data during the first run.
