# 📚 Bookstore Web Application (คลังหนังสือมรกต)

เว็บแอปพลิเคชันจัดการคลังหนังสือแบบ Full-Stack (NestJS + TypeORM + PostgreSQL + Next.js + TailwindCSS + JWT Auth) พร้อมระบบดึงปกหนังสืออัตโนมัติจาก Open Library ISBN API และดีไซน์ White & Emerald Green

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-12.0-E0234E?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌐 Live Production URLs (ระบบใช้งานจริงบน Cloud)

- ⚡ **Frontend Web Application (Vercel)**: `https://bookstore-frontend.vercel.app` *(หรือ Vercel Live URL ของคุณ)*
- 🚀 **Backend REST API (Render)**: [https://bookstore-backend-8cs7.onrender.com/api](https://bookstore-backend-8cs7.onrender.com/api)
- 🗄️ **Database (Supabase Cloud)**: PostgreSQL 16 Hosted Instance

---

## ✨ คุณสมบัติเด่นของระบบ (Key Features)

### 🎨 Frontend (Next.js 16 App Router + TailwindCSS)
- **White & Emerald Green Design System**: ธีมสีขาวมรกตสบายตา สะอาด สะท้อนความรู้สึกพรีเมียม
- **Open Library Cover Fetcher**: ดึงรูปปกหนังสืออัตโนมัติจาก ISBN API พร้อมระบบ SVG Dynamic Fallback Cover สวยงามเมื่อไม่มีรูป
- **Real-Time Live Search & Filter**: ค้นหาหนังสือจากชื่อ/ISBN และกรองหมวดหมู่/ผู้แต่งแบบทันที
- **Custom Modern Modals**: ไร้การใช้ `alert()` หรือ `confirm()` แบบดั้งเดิม ใช้ป๊อปอัปยืนยัน (Confirmation Modals) พร้อมไอคอน Vector SVG
- **Admin Management**: เข้าสู่ระบบด้วย JWT Token, เพิ่มหนังสือใหม่, ดูรายละเอียดหนังสือ และลบหนังสือออกคลัง
- **Fully Responsive**: จัดวาง Layout สวยงามรองรับทั้งมือถือ แท็บเล็ต และเดสก์ท็อป

---

## 📖 วิธีการเพิ่มหนังสือและดึงรูปปกอัตโนมัติ (Automatic ISBN Book Covers)

ระบบนี้เชื่อมต่อกับ **Open Library Covers API** อัตโนมัติ เมื่อล็อกอินเป็น Admin และกดเพิ่มหนังสือใหม่ **เพียงกรอกรหัส ISBN 10 หรือ 13 หลัก ระบบจะทำการดึงรูปปกหนังสือจริงมาแสดงผลทันที** โดยไม่ต้องอัปโหลดไฟล์รูปเอง!

### 📌 ตัวอย่างรหัส ISBN ที่ทดสอบแล้วว่ามีรูปปก (Tested Working ISBN List):

| ชื่อหนังสือ (Book Title) | รหัส ISBN (คัดลอกนำไปกรอกได้ทันที) |
| :--- | :--- |
| **Clean Code** | `9780132350884` |
| **Design Patterns** | `9780201633610` |
| **Refactoring** | `9780201485677` |
| **Clean Architecture** | `9780134494166` |
| **Head First Design Patterns** | `9780596007126` |
| **JavaScript: The Good Parts** | `9780596517748` |

*(หมายเหตุ: หากกรอก ISBN ที่ไม่มีในคลังของ Open Library ระบบจะสร้าง **Custom Emerald Fallback Cover** แสดงชื่อหนังสือและปกการ์ดมรกตให้โดยอัตโนมัติ)*

### ⚙️ Backend (NestJS + TypeORM + JWT Auth)
- **Layered Architecture (3 Layers)**: Controller ➔ Service ➔ Repository/Entity ชัดเจน 100%
- **Database Relational Schema**: 5 ตารางสัมพันธ์กัน (`books`, `authors`, `categories`, `users`, `book_authors`)
- **TypeORM Migrations**: จัดการ Schema ฐานข้อมูลด้วยไฟล์ Migration (ปราศจาก `synchronize: true`)
- **JWT Security & Password Hashing**: เข้ารหัสพาสเวิร์ดด้วย `bcrypt` และป้องกัน Route จัดการด้วย `JwtAuthGuard` (HTTP 401)
- **RESTful Conventions**: ออกแบบ HTTP Verbs และ Status Codes (`200`, `201`, `204`, `401`, `404`) ถูกต้องตามมาตรฐาน

---

## 🏗️ โครงสร้างสถาปัตยกรรมระบบ (Architecture)

```mermaid
flowchart TD
    Client["📱/💻 User Browser (Next.js App)"]
    API["🚀 NestJS REST API (Render.com)"]
    DB[("🗄️ PostgreSQL Database (Supabase)")]
    CoverAPI["🌐 Open Library Covers API"]

    Client -->|REST API Requests (/api)| API
    Client -->|Fetch ISBN Cover Images| CoverAPI
    API -->|TypeORM / SQL Queries| DB
```

---

## 🛠️ โครงสร้างไดเรกทอรี (Directory Structure)

```text
bookstore/
├── backend/                  # NestJS REST API Project
│   ├── src/
│   │   ├── auth/             # Auth Module (JWT & Guards)
│   │   ├── authors/          # Authors Module
│   │   ├── books/            # Books Module (Controller, Service, Entity)
│   │   ├── categories/       # Categories Module
│   │   ├── users/            # Users Module
│   │   ├── config/           # TypeORM & SSL Database Config
│   │   └── database/         # Migrations & Seed Scripts
│   └── package.json
├── frontend/                 # Next.js 16 Web Application
│   ├── app/
│   │   ├── components/       # UI Components (Navbar, BookCard, Modals)
│   │   ├── lib/              # API Client & Open Library Cover Helpers
│   │   ├── globals.css       # Tailwind & Glassmorphism Design Tokens
│   │   └── page.tsx          # Main Bookstore Dashboard
│   └── package.json
├── api-test.http             # สคริปต์สำหรับทดสอบ REST API ทั้งหมด
├── test.md                   # ข้อกำหนดและเป้าหมายโปรเจกต์
└── README.md
```

---

## 🚀 การติดตั้งและรันในเครื่อง (Local Setup)

### 1. Requirements
- Node.js 18+ หรือ 20+
- pnpm (หรือ npm / yarn)
- PostgreSQL (Localhost หรือ Cloud DB)

### 2. Clone Repository
```bash
git clone https://github.com/Threeraput/bookstore.git
cd bookstore
```

### 3. Setup Backend
```bash
cd backend
pnpm install

# สร้างไฟล์ .env
cp .env.example .env

# รัน Migration & Seed ข้อมูลเริ่มต้น
pnpm migration:run
pnpm seed

# รัน Development Server (Port 3001)
pnpm start:dev
```

### 4. Setup Frontend
```bash
cd ../frontend
pnpm install

# รัน Development Server (Port 3000)
pnpm dev
```

เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000) เพื่อใช้งานระบบ! 🎉

---

## 🔐 ข้อมูลผู้ใช้สำหรับทดสอบ (Admin User Credentials)

| Username | Password | Role |
| :--- | :--- | :--- |
| `admin` | `admin123` | Administrator |

---

## 📄 License

Project is [MIT Licensed](LICENSE).
