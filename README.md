# Banner App

Monorepo: Angular frontend + NestJS backend (skeleton without business routes yet).

## Run backend

```bash
cd backend && npm install && npm run start:dev
```

Listens on `http://localhost:3000` with global prefix `/api`.

## Run frontend

```bash
cd frontend && npm install && npm start
```

Open `http://localhost:4200`.

## Stack

- Frontend: Angular 21 (standalone, lazy routes), RxJS
- Backend: NestJS 11, Express
