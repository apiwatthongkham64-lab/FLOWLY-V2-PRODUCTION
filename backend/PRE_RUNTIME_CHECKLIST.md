# FLOWLY V1 — Pre-Runtime Checklist

On a machine with Node.js + npm + Docker:

1. `npm install` (first time only) to create the real `package-lock.json`.
2. Commit/retain that generated lockfile.
3. `npm ci` for reproducible dependency installation.
4. `docker compose up --build`.
5. `GET http://localhost:3000/api/v1/health`.
6. `node tests/smoke-auth.js`.

Do not hand-write or fabricate `package-lock.json`.
