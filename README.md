# angular-nest-skeleton

**Отдельный проект** (не внутри `banner-crud-app`): каталог на диске  
`/Users/svetlana/angular-nest-skeleton`

Минимальный каркас **Angular 19 + NestJS** — только архитектура, без бизнес-логики и без лишних npm-библиотек (без Material, CDK, сторонних UI).

## Структура

- `frontend/` — standalone Angular, lazy routes, `core` / `models` / `shared` / `layout` / `features`
- `backend/` — NestJS, префикс `/api`, модуль `items` как заготовка CRUD

## Запуск

```bash
cd backend && npm install && npm run start:dev
```

В другом терминале:

```bash
cd frontend && npm install && npm start
```

Прокси: запросы с фронта на `/api` → `http://localhost:3000`.

## Зависимости

- Frontend: только `@angular/*`, `rxjs`, `zone.js`, `tslib`
- Backend: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`
