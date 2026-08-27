เป้าหมาย: สร้างเว็บแอปพลิเคชันสำหรับดูรายชื่อหนังสือ เพิ่ม ค้นหา และลบหนังสือ โดยหนังสือแต่ละเล่มมีความสัมพันธ์กับผู้แต่ง (Author) และหมวดหมู่ (Category) พร้อมระบบยืนยันตัวตน (Authentication) เพื่อทดสอบความเข้าใจการทำางานแบบ MVC, การออกแบบ REST API, หลักการ OOP และการออกแบบฐานข้อมูลเชิงสัมพันธ์ (Relational DB Design)
Backend สถาปัตยกรรม MVC

แนบ API collection หรือสคริปต์ทดสอบ endpoint ท้งัหมดที่สร้ํางไว้ไวใ้นโปรเจกต์ใช้เครื่องมืออะไรก็ได้ เช่น
Bruno , Postman, Insomnia, ไฟล์ .http/.rest, หรือสคริปต์ curl เพื่อให้กรรมกํารตรวจสอบ API ได้สะดวก

//Nest js 
แยกชั้นสถาปัตยกรรมแบบ MVC/Layered ให้ชัดเจน อย่างน้อย 3 ชั้น: Controller, Service, Repository/Model ห้ามรวมทุกอย่างไว้ในไฟล์เดียว
ถ้าเลือก Node.js: แยกไฟล์ตามหน้าที่ (เช่น controllers/, services/, repositories/ หรือ models/) เขียน Service/Repository เป็น class ที่มี method ชัดเจน ไม่ใช่ route handler function เดี่ยวๆ ที คุยกับ DB ตรงๆ

API Endpoints หลัก (resource-based, ใช้ HTTP verb และ status code ให้ถูกต้องตาม REST convention):
 ○ GET /api/books: ส่งรายการหนังสือทั้งหมด รองรับ query filter ตาม categoryId และ/หรือ authorId (เช่น /api/books?categoryId=2) 
○ GET /api/books/:id: ส่งข้อมูลหนังสือเล่มเดียวตาม id ตอบ 404 ถ้าไม่พบ ○ POST /api/books: สร้างหนังสือใหม่ (ต้องอ้างอิง categoryId และ authorId(s) ที่มีอยู่จริง) ตอบ 201 พร้อมข้อมูลที่สร้าง 
○ DELETE /api/books/:id: ลบหนังสือตาม id ตอบ 204 เมื ่อส าเร็จ 404 ถ้าไม่พบ
 ○ GET /api/authors และ GET /api/categories: ส่งรายชื่อผู้แต่ง/หมวดหมู่ทั้งหมด สำหรับใช้ทำ dropdown ฝั่ง frontend
ส่วนที่ 2: การออกแบบฐานข้อมูล (Database Design) 
● ออกแบบ schema เอง อย่างน้อย 3 ตารางที่มีความสัมพันธ์กันจริงในระดับฐานข้อมูล 
○ Book — ข้อมูลหนังสือ 
○ Author — ข้อมูลผู้แต่ง 
○ Category — หมวดหมู่หนังสือ 
● สร้าง schema ผ่าน migration หรือสคริปต์ที่ทำซ้ำได้
 ● แนบ ER diagram หรือไฟล์ schema (เช่น schema.prisma, migration file, หรือรูปภาพ diagram) ไว้ในโปรเจกต์เป็นหลักฐานการออกแบบ
: ระบบยืนยันตัวตน Backend (Authentication) 
● ระบบ Login: สร้าง Endpoint POST /api/login สำหรับรับและตรวจสอบ Username กับ Password ● การสร้าง Token: สร้าง token-based auth (JWT) พร้อมก าหนดวันหมดอายุ แล้วส่งกลับไปให้ Frontend 
○ ถ้าเลือก .NET Core: ใช้ System.IdentityModel.Tokens.Jwt (หรือไลบรารีอื่นๆ) สร้าง JWT และ ตั้งค่า JWT Bearer Authentication middleware ของ ASP.NET Core 
○ ถ้าเลือก Node.js: ใช้ไลบรารี jsonwebtoken (หรือไลบรารีอืนๆ) สร้าง token ● Middleware/Filter ป้องกัน API: กรณีไม่มี token หรือ token ไม่ถูกต้อง ต้องตอบกลับ 401
○ ถ้าเลือก Node.js: เขียน middleware ตรวจสอบ Token จาก Header (Authorization: Bearer ) เอง แล้วนำไปครอบเฉพาะ route ที่ต้องป้องกัน 
○ นำการป้องกันนี้ไปครอบ Endpoint POST และ DELETE ของ /api/books เพื่อบังคับว่าต้องล็อกอินก่อนจึงจะจัดการหนังสือได้
