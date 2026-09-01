# FLOWLY Services API Core V1

Endpoints:
- GET /api/v1/services
- POST /api/v1/services
- PUT /api/v1/services/:id
- DELETE /api/v1/services/:id

Rules:
- Authentication required.
- `businessId` comes only from the authenticated session.
- Name is required.
- Duration must be a positive integer.
- Price must be non-negative.
- Duplicate service names within a business return 409.
- Services referenced by bookings cannot be deleted.
