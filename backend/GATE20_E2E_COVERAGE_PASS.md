# FLOWLY V1 Gate 20 — E2E Coverage PASS (test preparation)

A real gap was found in the existing smoke test: it only exercised registration, `/me`, customer CRUD, and logout. It did not exercise health, login, services, bookings, dashboard, conflict handling, or invalid status transitions.

The smoke test was upgraded to cover:
- health
- register/login/logout/session
- customer create/list/get/booking-history
- service create/list
- booking create/list
- booking status transition
- overlapping booking conflict
- dashboard summary/revenue/trend/today
- invalid status transition rejection
- protected endpoint after logout
- password-hash non-disclosure

The test is syntax-checked but cannot be claimed executed until a live PostgreSQL/API runtime is available.
