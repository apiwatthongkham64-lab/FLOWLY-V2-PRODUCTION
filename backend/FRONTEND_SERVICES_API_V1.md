# Services Frontend API V1

Added `services.html` with API-first CRUD:
- GET services
- POST service
- PUT service
- DELETE service

The page uses the authenticated HTTP-only session and never receives database credentials.
The current edit UI uses a lightweight prompt bridge; a modal can be refined later without changing the API contract.
