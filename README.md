# Holy Move

## Локальный запуск после нового клона

1. Установи зависимости из корня:

```bash
npm install
```

2. Создай `.env` из шаблона:

```bash
cp .env.example .env
```

Для Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. В `.env` для локального запуска укажи ключ:

```env
ORS_API_KEY=your_openrouteservice_key
```

4. Запусти backend:

```bash
npm run dev:server
```

5. В отдельном терминале запусти frontend:

```bash
npm run dev:client
```

6. Открой:

- frontend: `http://localhost:5173`
- backend: `http://localhost:3001`
