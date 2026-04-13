# Дизайн ролевой системы - Holy Move

## Типы пользователей

### 1. Клиенты (Customers)
- **Цель:** Найти и заказать услуги переезда
- **Действия:** Поиск, заказ, отслеживание, отзывы
- **Интерфейс:** Простой, минималистичный

### 2. Провайдеры (Providers)
#### Водители (Drivers)
- **Цель:** Выполнять транспортные заказы
- **Действия:** Управление маршрутами, расписанием, доходами
- **Интерфейс:** Фокус на маршрутах и статусах

#### Грузчики (Helpers)
- **Цель:** Выполнять погрузочные работы
- **Действия:** Поиск заказов, управление графиком, профиль
- **Интерфейс:** Фокус на доступных заказах и времени

#### Владельцы грузовиков (Truck Owners)
- **Цель:** Управлять автопарком и заказами
- **Действия:** Управление транспортом, заказами, доходами
- **Интерфейс:** Фокус на автопарке и загрузке

#### Мувинговые компании (Companies)
- **Цель:** Управлять бизнесом и командой
- **Действия:** Управление заказами, командой, аналитика
- **Интерфейс:** Комплексный дашборд

#### Посредники (Agents)
- **Цель:** Соединять клиентов с провайдерами
- **Действия:** Управление клиентами, сделками, аналитика
- **Интерфейс:** Фокус на CRM и сделках

### 3. Администраторы (Admins)
- **Цель:** Управление платформой
- **Действия:** Модерация, аналитика, настройки
- **Интерфейс:** Панель администрирования

## Механика входа и регистрации

### Вариант 1: Единая регистрация с выбором роли
```
1. Email/пароль → 2. Выбор роли → 3. Доп. поля для роли → 4. Подтверждение
```

### Вариант 2: Разные точки входа
```
Landing Page → "Я переезжаю" ИЛИ "Я предоставляю услуги"
→ Выбор типа провайдера → Регистрация для конкретной роли
```

### Вариант 3: Гибридная система
```
1. Базовая регистрация (email/пароль)
2. Возможность добавить несколько ролей
3. Переключение между ролями в профиле
```

## Структура данных пользователя

```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // hashed
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String
  },
  roles: [{
    type: String, // 'driver', 'helper', 'company', etc.
    status: String, // 'active', 'pending', 'suspended'
    verified: Boolean,
    data: {} // специфичные для роли данные
  }],
  currentRole: String, // активная роль
  preferences: {
    notifications: Object,
    language: String,
    timezone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Навигационная система

### Основная навигация (зависит от роли)
```
Клиент: Поиск → Заказы → Профиль
Провайдер: Дашборд → Заказы → График → Доходы → Профиль
Компания: Дашборд → Заказы → Команда → Автопарк → Аналитика → Профиль
Агент: Дашборд → Клиенты → Сделки → Аналитика → Профиль
```

### Переключение ролей
Если пользователь имеет несколько ролей:
```
Профиль → Переключить роль → Выбор → Редирект на дашборд роли
```

## Middleware для ролей

```javascript
// authMiddleware.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const userRole = req.user.currentRole;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};

// Использование
router.get('/driver/dashboard', checkRole(['driver']), driverController.getDashboard);
router.get('/company/analytics', checkRole(['company']), companyController.getAnalytics);
```

## Frontend контекст

```javascript
// AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  
  const switchRole = (role) => {
    setCurrentRole(role);
    // API call to update current role
  };
  
  return (
    <AuthContext.Provider value={{ user, currentRole, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Вопросы для обсуждения

1. **Какой вариант входа выбрать?** (единый, раздельный, гибридный)
2. **Нужна ли возможность иметь несколько ролей?**
3. **Как обрабатывать верификацию для разных ролей?**
4. **Какая структура навигации оптимальна?**
5. **Нужна ли система разрешений внутри ролей?**
