# Customers Delete Core V1

DELETE /api/v1/customers/:id

Rules:
- authenticated session required
- business_id comes from session
- return 404 if customer is outside current business
- return 409 CUSTOMER_HAS_BOOKINGS if bookings reference the customer
- return 204 only when deletion succeeds

Note: the current archive available for this step does not contain the previous backend source file, so this iteration records the contract and wires the UI only; backend route implementation should be applied to the canonical backend source before deployment.
