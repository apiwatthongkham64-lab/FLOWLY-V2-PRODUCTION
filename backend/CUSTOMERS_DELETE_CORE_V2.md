# Customers Delete Core V2

Canonical endpoint: DELETE /api/v1/customers/:id

Rules: authenticated session, business scope from session only, 404 when outside scope, 409 CUSTOMER_HAS_BOOKINGS when bookings exist, 204 on success.

Backend source consolidation is required before further feature work.