# FLOWLY V1 Gate 7 — Auth Identity Fix

Found and fixed an identity ambiguity before runtime:

- Login accepts email only.
- The schema previously allowed the same email in multiple businesses.
- That could make an email-only login resolve to the wrong business.

Fix:
- `users.email` is now globally unique in the V1 schema.
- Registration also returns deterministic `409 EMAIL_EXISTS` on a database unique race.

This is a required correctness fix, not a new feature.
