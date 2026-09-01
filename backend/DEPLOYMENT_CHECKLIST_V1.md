# FLOWLY Deployment Checklist V1

## Before deployment
- [ ] Provision PostgreSQL
- [ ] Apply `DATABASE_SCHEMA_V1.sql`
- [ ] Run seed only in development/staging
- [ ] Generate a strong random `SESSION_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Set `DATABASE_URL` via the hosting platform secret manager
- [ ] Install dependencies with `npm ci`
- [ ] Run the smoke test against a staging environment
- [ ] Put API behind HTTPS
- [ ] Configure frontend/API same-origin routing or explicit CORS + credentials policy
- [ ] Confirm cookies are Secure in production
- [ ] Back up database before migration

## After deployment
- [ ] `/api/v1/health` returns database reachable
- [ ] Register a test account
- [ ] Login/logout works
- [ ] `/me` returns the authenticated user
- [ ] Customers CRUD works
- [ ] Cross-business access is rejected
- [ ] Customer with bookings cannot be deleted
- [ ] Remove development seed/test accounts before production use

## Important
This project archive is a source package, not a deployed production service.
