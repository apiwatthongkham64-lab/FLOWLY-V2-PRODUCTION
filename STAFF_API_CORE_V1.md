# FLOWLY Staff API Core V1

Endpoints:

- GET /api/v1/staff
- POST /api/v1/staff
- GET /api/v1/staff/:id
- PUT /api/v1/staff/:id
- DELETE /api/v1/staff/:id


Rules:

- Authentication required.
- `businessId` comes only from the authenticated session.
- Staff records belong only to the current business.
- Name is required.
- Phone is optional.
- Role defaults to `staff`.
- Active defaults to `true`.
- Accessing staff from another business returns 404.
- Deleting staff outside current business returns 404.
- Staff deletion is allowed only when no future booking references exist.


Data Model:

staff

- id UUID PRIMARY KEY
- business_id UUID NOT NULL
- name VARCHAR(160) NOT NULL
- phone VARCHAR(40)
- role VARCHAR(50) NOT NULL DEFAULT 'staff'
- active BOOLEAN NOT NULL DEFAULT TRUE
- created_at TIMESTAMPTZ
- updated_at TIMESTAMPTZ


Response Rules:

- Never expose internal database information.
- Always return records scoped by authenticated business.
- Use standard FLOWLY response format:

Success:

{
  "data": {},
  "error": null
}


Failure:

{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}