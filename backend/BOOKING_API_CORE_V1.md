# FLOWLY Booking API Core V1

Endpoints:
- GET /api/v1/bookings
- POST /api/v1/bookings

Creation requires customer_id, service_id, booking_date, booking_time.

Rules:
- authenticated session required
- customer and active service must belong to the same business
- booking business scope comes from the session
- overlapping pending/confirmed bookings are rejected using service duration
- booking creation is serialized per business to prevent concurrent overlap races
- conflicts return 409 BOOKING_CONFLICT
