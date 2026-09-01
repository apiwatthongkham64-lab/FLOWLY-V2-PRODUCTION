# FLOWLY Backend API Core V1

## Scope
เริ่มจาก Customers API เท่านั้น เพื่อเชื่อม Frontend V1 โดยไม่รื้อ UI

## Endpoints
- GET /api/v1/customers
- POST /api/v1/customers
- GET /api/v1/customers/:id
- PUT /api/v1/customers/:id
- DELETE /api/v1/customers/:id
- GET /api/v1/customers/:id/bookings

## Request rules
1. Authentication ต้องเกิดก่อนเข้าถึง endpoint
2. อ่าน business_id จาก authenticated user/session เท่านั้น
3. ห้ามรับ business_id จาก browser เพื่อกำหนดขอบเขตข้อมูล
4. ทุก query ต้อง filter ด้วย business_id
5. Validate name และ phone ฝั่ง server
6. Return JSON ที่มีรูปแบบสม่ำเสมอ
7. DELETE ควรปฏิเสธเมื่อมี Booking ที่อ้างอิงลูกค้าอยู่

## Response shape

Success:
{
  "data": {},
  "error": null
}

Error:
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "..."
  }
}

## HTTP status
- 200 OK: อ่าน/แก้ไขสำเร็จ
- 201 Created: สร้างสำเร็จ
- 204 No Content: ลบสำเร็จ
- 400 Bad Request: input ไม่ถูกต้อง
- 401 Unauthorized: ยังไม่ได้เข้าสู่ระบบ
- 403 Forbidden: ไม่มีสิทธิ์
- 404 Not Found: ไม่พบข้อมูลใน business ของผู้ใช้
- 409 Conflict: ขัดแย้งกับข้อมูลที่มีอยู่

## Frontend migration
ปัจจุบัน:
localStorage → Customers Demo

เป้าหมาย:
Customers UI → API → PostgreSQL

ช่วง Migration ไม่ควรเขียนข้อมูลทั้ง localStorage และ API พร้อมกันแบบเงียบ ๆ เพราะอาจเกิดข้อมูลสองชุดไม่ตรงกัน

## Test cases
- list customers ของ business ตัวเอง
- ไม่เห็นลูกค้าของ business อื่น
- create customer
- update customer
- get customer detail
- customer booking history
- reject unauthenticated request
- reject invalid input
- reject cross-business access
- reject delete when referenced by booking
