# FLOWLY Dashboard Summary API V1

Endpoint:
`GET /api/v1/dashboard/summary`

Returns live counts scoped to the authenticated business:
- customers
- active_services
- today_bookings
- upcoming_bookings (next 7 days)

The Dashboard UI uses this API instead of hard-coded business numbers when API mode is available.
