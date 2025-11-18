# Holy Move - AI Truck Helper

## Деплой на Netlify

### Frontend (Netlify)

1. Подключите репозиторий к Netlify
2. Настройки сборки уже в `netlify.toml`
3. Установите переменную окружения:
   - `VITE_API_URL` = URL вашего backend API

### Backend

Вариант 1 - Heroku:

```bash
# В корневой директории
heroku create your-app-name
git subtree push --prefix server heroku main
```

Вариант 2 - Railway:

```bash
# Создайте проект на Railway
# Укажите команду сборки: npm start
# Корневая директория: server
```

### Локальная разработка

```bash
# Запуск backend
npm run dev

# Запуск frontend (в другом терминале)
cd frontend
npm run dev
```

## Переменные окружения

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3001
```

### Frontend Production (.env.production)

```env
VITE_API_URL=https://your-backend-url.com
```