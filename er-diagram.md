# ER Diagram — Book Management System

```mermaid
erDiagram
    CATEGORY ||--o{ BOOK : categorizes
    BOOK ||--o{ BOOK_AUTHORS : has
    AUTHOR ||--o{ BOOK_AUTHORS : writes

    USER {
        int id PK
        string username
        string password_hash
        datetime created_at
    }

    CATEGORY {
        int id PK
        string name
    }

    AUTHOR {
        int id PK
        string name
        string bio
    }

    BOOK {
        int id PK
        string title
        string isbn
        int published_year
        int category_id FK
        datetime created_at
    }

    BOOK_AUTHORS {
        int book_id FK
        int author_id FK
    }
```

## หมายเหตุการออกแบบ

- **Book–Author**: ความสัมพันธ์แบบ N–N ผ่านตาราง junction `book_authors` เนื่องจากโจทย์ระบุ `authorId(s)` (หนึ่งเล่มอาจมีหลายผู้แต่ง)
- **Category–Book**: ความสัมพันธ์แบบ 1–N เนื่องจาก endpoint filter `?categoryId=2` รับค่าเดียวต่อเล่ม
- **User**: แยกออกจาก Author โดยเจตนา — User คือบัญชีสำหรับ authentication ส่วน Author คือข้อมูลผู้แต่งหนังสือ (business entity) ไม่ผูกกัน
