# FLOWLY Dashboard Today API V1

Endpoint:
`GET /api/v1/dashboard/today`

Returns today's bookings for the authenticated business, ordered by booking time.
Includes customer name/phone, service, time, duration, price, and status.

The dashboard uses the existing booking source and does not create a second schedule store.
