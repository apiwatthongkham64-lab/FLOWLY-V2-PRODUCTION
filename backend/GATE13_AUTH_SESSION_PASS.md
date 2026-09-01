# FLOWLY V1 Gate 13 — Auth / Session Deep Check PASS

The first audit pass produced a false positive because it treated the internal `password_hash` SELECT used for password verification as an API leak.

Re-inspection of the actual route bodies confirms:
- password_hash is selected internally only for verification
- register/login/me responses do not return password_hash
- sessions use an environment-provided secret
- session cookie is HTTP-only and SameSite=Lax
- logout clears the cookie
- protected routes use the session
- core backend syntax passes

No application code change was required.
