# FLOWLY V1 — Local Integration Run

## 1. PostgreSQL
Create a database and apply:
`DATABASE_SCHEMA_V1.sql`

## 2. Backend
Copy `.env.example` to `.env` and set:
- DATABASE_URL
- SESSION_SECRET
- PORT

Then:
`npm install`
`npm start`

## 3. Frontend
Serve the project root over HTTP (do not open HTML with `file://`).
Set:
`window.FLOWLY_API_BASE = "http://localhost:3000"`

The frontend pages are static and use the authenticated HTTP-only session.

## 4. Integration acceptance flow
Register → Login → Customers → Services → Booking → Status → Calendar → Dashboard → Revenue → Today.

## 5. Important
This is a local integration guide. It does not claim that PostgreSQL or the API is running inside this archive.
