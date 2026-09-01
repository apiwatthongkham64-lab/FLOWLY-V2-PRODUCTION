# FLOWLY Booking Status API V1

Endpoint:
`PATCH /api/v1/bookings/:id/status`

Allowed workflow:
- pending -> confirmed
- pending -> cancelled
- confirmed -> completed
- confirmed -> cancelled
- completed/cancelled are terminal

Invalid transitions return 409 INVALID_STATUS_TRANSITION.
