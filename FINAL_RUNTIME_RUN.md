# FLOWLY V1 — FINAL RUNTIME RUN

## Target
Run on a machine with Docker + Node.js + npm.

## Before start
- Create a real `.env` from `.env.example`.
- Set a strong random `POSTGRES_PASSWORD`.
- Set a strong random `SESSION_SECRET`.
- Run `npm install` once to generate a real `package-lock.json`.
- Then use `npm ci`.

## Runtime
- `docker compose up --build`
- Confirm PostgreSQL is healthy.
- Confirm `GET /api/v1/health` returns 200.

## E2E
- `FLOWLY_API=http://localhost:3000 node tests/smoke-auth.js`

## Acceptance
The smoke test must print:
`FLOWLY E2E SMOKE: PASS`

Do not enter real customer data until this run passes.
