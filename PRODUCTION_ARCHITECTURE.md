# FLOWLY — Production Architecture V1

## 1. เป้าหมาย
ย้ายจาก Frontend Demo ไป Production โดยไม่รื้อ UX/Core ที่ทำไว้แล้ว

## 2. ชั้นระบบ
- Frontend: HTML/CSS/JS เดิม → เปลี่ยนจุดอ่าน/เขียนข้อมูลให้เรียก API
- API: REST/JSON เป็นตัวกลางระหว่าง Frontend กับ Database
- Database: PostgreSQL (แนะนำสำหรับ Production)
- Authentication: Session หรือ secure HTTP-only cookie
- Authorization: Role-based access control (RBAC)

## 3. Core Data Model
### businesses
- id
- name
- phone
- created_at
- updated_at

### users
- id
- business_id
- name
- email
- password_hash
- role
- created_at
- updated_at

### customers
- id
- business_id
- name
- phone
- created_at
- updated_at

### services
- id
- business_id
- name
- duration_minutes
- price
- active
- created_at
- updated_at

### bookings
- id
- business_id
- customer_id
- service_id
- booking_date
- booking_time
- status
- created_at
- updated_at

## 4. ความสัมพันธ์
business
  ├── users
  ├── customers
  ├── services
  └── bookings
          ├── customer
          └── service

## 5. API ชุดแรก
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /me
- GET /business
- PUT /business
- GET /customers
- POST /customers
- GET /customers/:id
- GET /customers/:id/bookings
- GET /services
- POST /services
- GET /bookings
- POST /bookings
- PATCH /bookings/:id/status
- GET /dashboard/summary

## 6. Security Boundary
ห้ามเก็บ password หรือ password token ใน localStorage
ใช้ password_hash ฝั่ง server
ใช้ HTTPS
ตรวจสิทธิ์ business_id ทุก request
ใช้ parameterized queries/ORM
validate input ฝั่ง server แม้ Frontend จะ validate แล้ว

## 7. Migration จาก Demo
ปัจจุบัน:
localStorage → Demo

Production:
localStorage
   ↓
API
   ↓
PostgreSQL

ไม่ควรให้ Frontend ต่อ Database โดยตรง

## 8. ลำดับการพัฒนา
1. Database schema
2. Backend/API
3. Authentication จริง
4. Customers API
5. Services API
6. Bookings API
7. Dashboard API
8. เปลี่ยน Frontend จาก localStorage → API
9. Security test
10. Deployment

## 9. กฎของโปรเจกต์
เพิ่มทีละ Core
ทดสอบทุกครั้งหลังเปลี่ยน
ไม่รื้อ UI ที่ผ่านแล้วโดยไม่มีเหตุผล
ไม่เพิ่ม Feature นอก Scope ก่อน Core ปัจจุบันเสถียร
