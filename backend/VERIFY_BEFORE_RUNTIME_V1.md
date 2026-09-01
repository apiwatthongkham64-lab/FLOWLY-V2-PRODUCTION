# FLOWLY V1 Verification Gate

Pre-runtime:
- node --check server.js
- node --check auth.js
- node --check db.js
- node tests/verify-contract.js

Runtime:
- start PostgreSQL + API
- GET /api/v1/health
- node tests/smoke-auth.js

The pre-runtime checks do not prove PostgreSQL integration.
