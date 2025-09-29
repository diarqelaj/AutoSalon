# LuxeRide — Next.js College Project (LAB1)

This is a full-stack **auto dealership** demo built for LAB1 by:

- **Dijar Qelaj**
- **Diar Zekiqi**
- **Lend Shefkiu**

The app showcases a modern Next.js frontend, a typed UI system, and a clean REST API for inventory, models, brands, and authentication.

---

## What this project does

- **Browse inventory** (grid, pagination, image preloading, status badges for *Available / Reserved / Sold*).
- **Vehicle details** with friendly URLs and fast “above-the-fold” loading.
- **Admin dashboard** (role-gated) with CRUD for **Vehicles, Models, Brands** (+ quick Fleet panel).
- **Auth flow** (register, login, refresh, logout) using JWT access/refresh tokens.
- **Contact & static pages** (Privacy, Terms) designed for production readability.

> The goal is to demonstrate production-style patterns (optimistic UI, small client cache, guarded routes, lazy loading) in an educational setting.

---

## Architecture (high level)

- **Frontend**: Next.js (App Router), TypeScript, Shadcn UI components, Tailwind CSS.
- **State/UX**: Optimistic updates, tiny in-memory caches for admin lists, Intersection Observer for image preloads.
- **API**: ASP.NET Core Web API with EF Core, SQL database.
- **Auth**: JWT access token + rotating refresh token. Role claims control admin pages.

> No secrets, connection strings, or real keys are included here. See **Environment** below for placeholders.

---

## API overview (without data)

**Auth**  
- `POST /api/auth/register` — create account  
- `POST /api/auth/login` — issue access/refresh tokens  
- `POST /api/auth/refresh` — rotate refresh token  
- `POST /api/auth/logout` — invalidate refresh token  
- `GET  /api/auth/me` — current user profile (auth required)

**Admin (role: Admin)**  
- `GET    /api/auth/admin/users` — list users (paging/search)  
- `GET    /api/auth/admin/users/{id}` — get one  
- `POST   /api/auth/admin/users` — create  
- `PUT    /api/auth/admin/users/{id}` — update (incl. role/active)  
- `DELETE /api/auth/admin/users/{id}` — delete

**Inventory**  
- `GET    /api/vehicles` — list vehicles  
- `GET    /api/vehicles/{id}` — details (includes `basePrice`)  
- `POST   /api/vehicles` — create (admin)  
- `PUT    /api/vehicles/{id}` — update (admin)  
- `DELETE /api/vehicles/{id}` — delete (admin)  
- `GET    /api/vehicles/fleet` — read-only projection used by the public grid

**Catalog**  
- `GET/POST/PUT/DELETE /api/models`  
- `GET/POST/PUT/DELETE /api/brands`

> Responses are JSON. Authentication uses the `Authorization: Bearer <token>` header when required.

---

## Frontend quick start

```bash
# install deps
npm i

# dev server
npm run dev
# open http://localhost:3000
