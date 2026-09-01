# FLOWLY V1 — Upload Ready

## Deployment order
1. Extract this package on the target machine.
2. In `backend/`, run `npm install` once to create a real `package-lock.json`.
3. After the lockfile is generated, use `npm ci` for subsequent clean installs.
4. Configure `.env` from `.env.example` with real secrets and database credentials.
5. Run `docker compose up --build`.
6. Verify `GET /api/v1/health`.
7. Run the smoke/E2E checks before entering real customer data.

## Important
- Never commit or upload the real `.env`.
- Do not fabricate `package-lock.json`.
- This package is source/upload-ready; live runtime success still requires execution on a Docker-capable target.
