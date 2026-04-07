# Holy Move (Local Only)

Проект настроен только для локальной разработки.
Используется монорепо на `npm workspaces` (frontend в `frontend/`).

## Запуск

1. Создай `.env` в корне (можно скопировать из `.env.example`):
```env
PORT=3001
ORS_API_KEY=your_key_here
```

2. Установи зависимости из корня:
```bash
npm install
```

3. Если остался старый `frontend/node_modules`, удали его вручную.

4. Запусти backend:
```bash
npm run dev:server
```

`dev:server` runs in watch mode and reloads backend changes automatically.

5. В отдельном терминале запусти frontend:
```bash
npm run dev:client
```

6. Открой:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Что работает

- `POST /api/helpers`
- `POST /api/maps/route`
- `POST /api/ai-local`
- `GET /api/health`
