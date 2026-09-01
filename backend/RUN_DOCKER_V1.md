# FLOWLY V1 — One-command local runtime

Requirements:
- Docker Desktop / Docker Engine with Compose

From the `backend` folder:

```bash
docker compose up --build
```

API:
`http://localhost:3000`

Health check:
`http://localhost:3000/api/v1/health`

Run the smoke test from another terminal after the API is healthy:

```bash
node tests/smoke-auth.js
```

The database is initialized automatically from `DATABASE_SCHEMA_V1.sql` on the first
creation of the PostgreSQL volume.

This compose file is for local development/testing only. Change all credentials
before any real deployment.
