# Backend — How to Run
## Install
```bash
npm install
```
## Environment
Create a `.env` file (see `.env.example`).
## Start
```bash
npm run start
# or, during development
npm run dev
```
## Healthcheck
`GET /health`

## Auth flow
1. POST /api/auth/login → returns { token, user }
2. Use Authorization: Bearer <token> on protected routes.

## Detected Routers (best-effort)
- /mnt/data/upload_unpacked/root_zip/server/app.js — GET /health
- /mnt/data/upload_unpacked/root_zip/server/routes/auth.routes.js — POST /login
- /mnt/data/upload_unpacked/root_zip/server/routes/chat.routes.js — GET /ping
- /mnt/data/upload_unpacked/root_zip/server/routes/chat.routes.js — POST /
- /mnt/data/upload_unpacked/root_zip/server/routes/roles.routes.js — GET /
- /mnt/data/upload_unpacked/root_zip/server/routes/roles.routes.js — POST /
