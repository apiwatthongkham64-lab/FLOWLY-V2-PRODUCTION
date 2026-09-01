# FLOWLY V1 Gate 17 — Deployment / Persistence PASS

Two real deployment issues were found and fixed:
1. Docker Compose had hardcoded development database credentials and a development session secret.
2. API/DB services had no restart policy.

Fixes:
- DB credentials are now required from `.env`.
- DATABASE_URL is assembled from environment variables.
- SESSION_SECRET is required from `.env`.
- API runs with `NODE_ENV=production`.
- API and DB use `restart: unless-stopped`.
- Database remains persistent and healthy before API startup.
- Real secrets are not bundled; `.env.example` contains placeholders only.

No application business logic was changed.
Live container startup remains the final runtime proof.
