# FLOWLY Dashboard Revenue API V1

Endpoint:
`GET /api/v1/dashboard/revenue`

Window:
- last 30 calendar days through today

Metrics:
- `completed_revenue`: sum of service prices for completed bookings
- `confirmed_revenue`: sum of service prices for confirmed + completed bookings
- completed booking count
- confirmed/completed booking count

Revenue is derived from booking service prices; it is not an accounting ledger or payment reconciliation.
