# Структура Holy Move Platform - План

## Текущая ситуация
- Есть работающий лендинг (LandingPage.jsx)
- Созданы макеты для разных типов пользователей
- Нужно спланировать оптимальную структуру

## Предлагаемая структура

### Frontend (frontend/src/)
```
src/
├── components/           # Переиспользуемые компоненты
│   ├── common/         # Общие компоненты
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   ├── forms/          # Формы
│   │   ├── SearchForm.jsx
│   │   ├── LoginForm.jsx
│   │   └── RegistrationForm.jsx
│   └── ui/            # UI элементы
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Badge.jsx
├── pages/              # Страницы
│   ├── client/         # Клиентские страницы
│   │   ├── LandingPage.jsx
│   │   ├── SearchResults.jsx
│   │   └── OrderTracking.jsx
│   ├── provider/       # Страницы провайдеров
│   │   ├── DriverPage.jsx
│   │   ├── HelperPage.jsx
│   │   ├── TruckPage.jsx
│   │   ├── CompanyPage.jsx
│   │   └── AgentPage.jsx
│   └── admin/         # Админские страницы
│       ├── Dashboard.jsx
│       ├── UsersManagement.jsx
│       └── Analytics.jsx
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useOrders.js
│   └── useNotifications.js
├── services/           # API сервисы
│   ├── api.js
│   ├── auth.js
│   ├── orders.js
│   └── providers.js
├── utils/              # Утилиты
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── context/            # React Context
│   ├── AuthContext.js
│   └── OrderContext.js
└── styles/             # Стили
    ├── globals.css
    └── components.css
```

### Backend (server/)
```
server/
├── controllers/        # Контроллеры
│   ├── authController.js
│   ├── orderController.js
│   ├── providerController.js
│   └── userController.js
├── middleware/         # Middleware
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── models/            # Модели данных
│   ├── User.js
│   ├── Order.js
│   ├── Provider.js
│   └── database.schema.js
├── routes/            # Роуты
│   ├── auth.routes.js
│   ├── orders.routes.js
│   ├── providers.routes.js
│   └── admin.routes.js
├── services/          # Бизнес логика
│   ├── authService.js
│   ├── orderService.js
│   ├── ratingService.js
│   └── aiOptimizer.js
├── utils/             # Утилиты
│   ├── database.js
│   ├── logger.js
│   └── helpers.js
└── config/            # Конфигурация
    ├── database.js
    ├── jwt.js
    └── environment.js
```

## Вопросы для обсуждения

### 1. Ролевая система
- Как будем определять роль пользователя при входе?
- Нужна ли отдельная регистрация для каждой роли?
- Как обрабатывать переключение между ролями?

### 2. Навигация
- Делать общую навигацию или разную для каждой роли?
- Как реализовать переход между ролями?
- Нужна ли "супер-навигация" для переключения контекста?

### 3. Аутентификация
- JWT токены или сессии?
- Как хранить информацию о роли?
- Нужна ли двухфакторная аутентификация?

### 4. База данных
- MongoDB или PostgreSQL?
- Как связывать пользователей с их ролями?
- Нужна ли система разрешений (permissions)?

### 5. AI интеграция
- Как именно AI будет работать как оптимизатор?
- Какие данные будет анализировать?
- Как интегрировать с системой рейтингов?

## Следующие шаги
1. Обсудить структуру и ответы на вопросы
2. Создать базовую файловую структуру
3. Реализовать ролевую middleware
4. Создать систему навигации
5. Интегрировать с существующим кодом
