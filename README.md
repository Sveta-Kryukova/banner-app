# Banner App

A mini app for managing advertising banners: **Angular** client + **NestJS** server. Full **CRUD** with images stored as **Base64** and persisted in a **local JSON file**.

## Prerequisites

- **Node.js** LTS (20+ recommended)
- npm

## Quick start

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

- API base: **`http://localhost:3000/api`**
- OpenAPI (Swagger): **`http://localhost:3000/api/swagger`**

Data is stored in **`backend/data/banners.json`** (created automatically).

### 2. Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

Open **`http://localhost:4200`**.

Set the API base URL in `frontend/src/environments/environment.ts` (`apiBaseUrl`, default `http://localhost:3000/api`). Start the backend before using the app.

## Features

**Frontend**

- **Banner list** page (loads from the server; infinite scroll for more items).
- Per banner: **Edit**, **Delete** (with confirmation).
- **Create / edit** page: name, **JPG/PNG** upload, preview, **remove image** before save, **Cancel** with unsaved-changes guard.
- Navigation between list and form (header + routes).
- **Save** sends JSON `{ name, imageBase64 }` (**POST** for create, **PATCH** for update).

**Backend**

- **POST** `/api/banners` — accept banner (name + Base64), save to file.
- **GET** `/api/banners` — paginated list; **GET** `/api/banners/:id` — single banner.
- **PATCH** `/api/banners/:id` — update; **DELETE** `/api/banners/:id` — delete.

## Stack

| Part   | Technologies |
|--------|--------------|
| Frontend | Angular 21+, Angular Material, RxJS, SCSS |
| Backend  | Node.js, NestJS, class-validator, Swagger |

## Useful commands

```bash
# Frontend lint
cd frontend && npm run lint

# Backend lint
cd backend && npm run lint

# Frontend production build
cd frontend && npm run build

# Backend build
cd backend && npm run build
```

## Repository layout

- **`frontend/`** — Angular app (`src/app`: features, shared, services, HTTP interceptor).
- **`backend/`** — NestJS (`src/banners`, persistence in `data/banners.json`).
