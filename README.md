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

- **GET** `/api/health` — liveness-style check (`status`, `timestamp`) for monitoring or load balancers.
- **POST** `/api/banners` — accept banner (name + Base64), save to file.
- **GET** `/api/banners` — paginated list; **GET** `/api/banners/:id` — single banner.
- **PATCH** `/api/banners/:id` — update; **DELETE** `/api/banners/:id` — delete.

## Architecture

**Frontend** follows a thin **smart container / dumb UI** split: route-level **pages** wire **facades** (`BannerFormFacade`, `BannerListFacade`) for state, RxJS, and navigation; **presentational** components (`banner-card`, `banner-create-form`, `banner-image-drop`) stay declarative and event-driven. Cross-cutting concerns live in **core** (HTTP interceptor) and **shared** (dialogs, toasts, buttons). Data access is isolated in **`BannerApiService`**; file/Base64 handling in **`BannerImageFileService`**.

**Backend** uses a classic Nest layering: **controller** (HTTP + Swagger) → **service** (business rules, id generation) → **repository** (JSON file I/O). Stored payloads are validated with **class-validator** DTOs; malformed files fail fast with typed HTTP errors.

## Testing & quality

- **Backend:** Jest + `ts-jest`, `@nestjs/testing` — unit tests for `parseStoredBanners` and `BannersService` (mocked repository). Run `cd backend && npm test`; coverage: `npm run test:cov`.
- **Frontend:** Vitest via Angular’s `unit-test` builder — tests for `BannerImageFileService` (validation, Base64 pipeline). Run `cd frontend && npm test`.

Continuous integration (GitHub Actions) runs **lint, test, and build** for both packages on push/PR (see `.github/workflows/ci.yml`).

## Configuration

- Optional **`backend/.env.example`** — copy pattern for `PORT` (default **3000** if unset).
- Frontend API URL: `frontend/src/environments/environment.ts` (`apiBaseUrl`).

## Stack

| Part   | Technologies |
|--------|--------------|
| Frontend | Angular 21+, Angular Material, RxJS, SCSS |
| Backend  | Node.js, NestJS, class-validator, Swagger |

## Useful commands

```bash
# Frontend: lint, test, production build
cd frontend && npm run lint && npm test && npm run build

# Backend: lint, test, build
cd backend && npm run lint && npm test && npm run build
```

## Repository layout

- **`frontend/`** — Angular app (`src/app`: features, shared, services, HTTP interceptor). Build and tests use **`@angular/build`** (application + unit-test builders).
- **`backend/`** — NestJS (`src/banners`, `src/health`, persistence in `data/banners.json`).
