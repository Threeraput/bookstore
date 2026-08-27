# Backend Development Rules — Book Management API (NestJS)

These rules are for an AI coding agent working on the backend. Follow them for every file
you generate or edit. If a rule conflicts with a specific instruction from the user, the
user's instruction wins — but flag the conflict.

## 1. Architecture

- Enforce a strict layered structure: **Controller → Service → Repository/Entity**. Minimum 3 layers.
- Never put database queries, business logic, or validation logic directly inside a controller.
- Never write a route handler as a bare function that talks to the DB directly — always delegate to a Service class.
- One module per resource (`books`, `authors`, `categories`, `auth`, `users`), each in its own folder with its own controller/service/entity/dto.
- Service and Repository logic must be written as classes with clearly named methods (e.g. `findAll()`, `findById()`, `create()`, `remove()`) — not anonymous functions.
- Do not put unrelated logic in `app.module.ts` or `main.ts` beyond bootstrapping/global config.

## 2. API design (REST conventions)

- Resource-based URLs only (`/api/books`, not `/api/getBooks`).
- Use correct HTTP verbs: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove).
- Use correct status codes:
  - `200` for successful `GET`
  - `201` for successful `POST`, response body includes the created resource
  - `204` for successful `DELETE`, empty response body
  - `400` for validation errors (bad input, missing required field, referencing a non-existent related id)
  - `401` for missing/invalid auth token
  - `404` for a resource that doesn't exist
- Query parameters for filtering (`?categoryId=2&authorId=5`), never for actions.
- Every endpoint's request/response shape must be defined by a DTO class with `class-validator` decorators — never accept raw untyped `any` bodies.

## 3. Database & entities

- Use TypeORM entities to define schema; never hand-write raw SQL unless explicitly asked.
- `synchronize: false` always — schema changes go through migrations only, never auto-sync.
- Every new/changed entity must be paired with a generated migration file in the same change.
- Foreign key relationships must match the agreed ER design:
  - `Book` → `Category`: many-to-one
  - `Book` ↔ `Author`: many-to-many (join table `book_authors`)
  - `User`: standalone, no relation to `Book`/`Author`/`Category`
- Before inserting a `Book`, validate that referenced `categoryId` and `authorId(s)` actually exist in the database — return `400` if not, don't rely on a DB constraint error leaking to the client.
- Never expose `password_hash` (or any password field) in an API response — exclude it explicitly in the entity or DTO serialization.

## 4. Authentication & authorization

- Passwords are hashed with `bcrypt` before storage. Never store or log plaintext passwords.
- JWT must have an expiry (`expiresIn`) set — never issue a token with no expiration.
- Auth guard checks the `Authorization: Bearer <token>` header; missing or invalid token → `401`, not a silent pass-through or a 500.
- Only apply the auth guard to the endpoints that require it (`POST /api/books`, `DELETE /api/books/:id`) — do not accidentally lock down `GET` endpoints.
- Never hardcode the JWT secret in source code — read it from environment variables (`.env`, not committed to git).
- Never log JWT tokens or password hashes to the console in production code.

## 5. Error handling

- Use a global exception filter so every error response follows the same JSON shape (e.g. `{ statusCode, message, error }`).
- Don't let raw database or stack-trace errors reach the client — catch and translate them.
- Validation failures should return a clear list of what's wrong (`class-validator`'s default messages are fine), not a generic "bad request."

## 6. Code style & hygiene

- TypeScript strict mode — no implicit `any`.
- Consistent naming: `camelCase` for variables/methods, `PascalCase` for classes, `kebab-case` for filenames (NestJS convention: `books.controller.ts`, `create-book.dto.ts`).
- No commented-out dead code left in commits.
- No `console.log` left in for debugging — use NestJS's built-in `Logger` if logging is needed.
- Every new environment variable must be added to `.env.example` with a placeholder value.

## 7. What NOT to do

- Do not use `synchronize: true`, even "just for now."
- Do not skip DTO validation "to save time."
- Do not put auth logic inline in controllers instead of using a Guard.
- Do not return entities directly if they contain sensitive fields — map to a response DTO first.
- Do not invent extra endpoints or fields not in the API spec without flagging it to the user first.

## 8. Before marking a task done

- Confirm the endpoint matches the exact method + path + status codes in the spec.
- Confirm a migration exists for any schema change.
- Confirm sensitive fields are excluded from responses.
- Confirm the relevant guard is (or isn't) applied as specified.
