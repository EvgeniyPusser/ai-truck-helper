# Анализ текущей БД и План миграции на PostgreSQL

**Дата:** 2026-08-18  
**Статус:** Актуально для проекта "Holy Move"  
**Размер проекта:** БОЛЬШОЙ (планируется масштабирование)

---

## Резюме текущего состояния

### Проблемы ("жопа была")
1. **Гибридная архитектура БД** — одновременно используются Prisma (PostgreSQL) + MongoDB (fallback)
2. **Несогласованность данных** — разные модели сохраняются в разные БД
3. **Конфликты интеграции** — Prisma работает с PostgreSQL, но MongoDB код остаётся в коде
4. **Путаница в конфигурации** — множество env-переменных (`DATABASE_URL`, `DIRECT_URL`, `DB_URL`, `MONGODB_URI`)
5. **Незавершённые попытки** — Prisma schema есть, но MongoDB integration остаётся как "страховка"

### Что работает сейчас
✅ Express.js API с основными endpoints  
✅ React frontend с роутингом  
✅ Prisma ORM с двумя моделями:
  - `HelperQuoteRequest` — сохранение quote запросов
  - `ApiRequestLog` — логирование всех API запросов  
✅ MongoDB fallback для providers (если PostgreSQL недоступна)  
✅ Базовая валидация запросов  
✅ API request logging middleware  

### Что НЕ работает / незавершено
❌ MongoDB как основная БД (конфликтует с Prisma/PostgreSQL)  
❌ Чистая PostgreSQL-only конфигурация  
❌ Schema migrations (нет Prisma migrations в репо)  
❌ Обработка ошибок БД на production  
❌ Transaction support  
❌ Rollback механизм  

---

## ТЕКУЩАЯ АРХИТЕКТУРА

### 1. Prisma (PostgreSQL) - ОСН. ПОПЫТКА
**Файл:** `prisma/schema.prisma`

```prisma
// ✅ Реализовано
model HelperQuoteRequest {
  id              String   @id @default(cuid())
  pickupZip       String
  dropoffZip      String
  helpers         Float?
  rooms           Float?
  volume          Float?
  moveDate        String?
  request         Json     // сохр. весь payload
  response        Json     // сохр. весь результат
  resultCount     Int      @default(0)
  selectedOfferId String?
  aiStatus        String?
  aiText          String?
  aiModel         String?
  aiError         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@map("helper_quote_requests")
}

model ApiRequestLog {
  id           String   @id @default(cuid())
  method       String
  path         String
  statusCode   Int
  durationMs   Int
  origin       String?
  ip           String?
  userAgent    String?
  query        Json?
  requestBody  Json?
  responseBody Json?
  error        String?
  createdAt    DateTime @default(now())
  @@map("api_request_logs")
}
```

**Интеграция:**
- `server/db/prisma.js` — инициализация PrismaClient с adapter-pg
- `server/services/apiRequestLogs.js` — middleware для логирования всех API запросов → `api_request_logs`
- `server/services/helperQuoteRequests.js` — сохранение quote requests → `helper_quote_requests`
- Автоматически генерируется типизация при `npm install` (postinstall hook)

**Проблемы:**
- Не отправляются migrations в репо (нет `prisma/migrations/`)
- Fallback на MongoDB если PostgreSQL недоступна → путаница
- Не используется для providers (они в MongoDB)

### 2. MongoDB - FALLBACK / LEGACY
**Файл:** `server/db/mongo.js`

```javascript
// Параметры
const uri = process.env.MONGODB_URI || process.env.DB_URL || ""
const dbName = process.env.MONGODB_DB_NAME || "holy_move"
const mongoDisabled = process.env.MONGODB_DISABLED  // можно отключить

// Функции
isMongoConfigured()     // проверка, включен ли
connectMongo()          // ленивое подключение
getDb()                 // получить DB instance
getMongoHealth()        // health check для /api/health
closeMongo()            // graceful shutdown
```

**Использование:**
- `server/services/providersDb.js` — чтение providers, seeding
- `server/routes/providers.routes.js` — GET/POST providers
- `server/app.js` — health check возвращает `mongo.connected`

**Проблемы:**
- Слабая типизация (нет схемы)
- Проблема с консистентностью данных
- Providers могут быть в MongoDB или JSON-файле

### 3. Hybrid Startup Logic
**Файл:** `server/index.js`

```javascript
async function start() {
  // Если MongoDB включён → пробуем подключиться
  if (isMongoConfigured()) {
    try {
      await connectMongo()
    } catch (error) {
      // ⚠️ Ошибка? Пропускаем, продолжаем с Prisma
      console.error("[HolyMove] MongoDB unavailable; starting API without persistence:", error)
    }
  }
  
  // Запускаем сервер (с Prisma или без)
  server.listen(PORT, () => {
    console.log(`[HolyMove] API listening on :${PORT}`)
  })
}
```

**Фатальное несоответствие:** API полагается на обе БД, но они не синхронизированы.

---

## ЧТО НАДО СДЕЛАТЬ

### Фаза 1: Очистка и Стандартизация (IMMEDIATE)

#### 1.1. Удалить MongoDB fallback
```bash
# Удалить из кода
rm server/db/mongo.js  # ❌ bye mongo
```

**Действия:**
- [ ] Удалить `server/db/mongo.js`
- [ ] Удалить `server/services/providersDb.js` (MongoDB-specific)
- [ ] Удалить из `package.json` зависимость `mongodb`
- [ ] Очистить `.env.example`: удалить `MONGODB_*`, `DB_URL`
- [ ] Обновить `server/app.js` — убрать mongo health check
- [ ] Обновить `server/index.js` — убрать mongo connection logic

**Результат:** Чистый PostgreSQL через Prisma.

#### 1.2. Стандартизировать env переменные
```dotenv
# ЧТО БЫЛО
DATABASE_URL=postgres://...
DIRECT_URL=postgres://...
DB_URL=mongodb://...
MONGODB_URI=mongodb://...

# ЧТО НАДО
DATABASE_URL=postgres://user:pass@host:5432/holy_move
```

**Действия:**
- [ ] Оставить только `DATABASE_URL` (Prisma standard)
- [ ] Обновить `.env.example`
- [ ] Обновить `server/db/prisma.js` — использовать только `DATABASE_URL`
- [ ] Документировать в README.md как настроить PostgreSQL

---

### Фаза 2: Миграция на PostgreSQL (SHORT-TERM)

#### 2.1. Создать Prisma migrations
```bash
npm run prisma:generate    # создать типы
npm run prisma:push       # создать таблицы (если схема меняется)
```

**Действия:**
- [ ] Убедиться, что `prisma/schema.prisma` актуальна
- [ ] Запустить `prisma migrate dev --name init` (создаёт миграцию)
- [ ] Коммитить `prisma/migrations/` в репо
- [ ] Добавить в package.json скрипты:
  ```json
  "prisma:migrate": "prisma migrate deploy",
  "prisma:studio": "prisma studio"
  ```

#### 2.2. Перенести providers в PostgreSQL
**Текущее:**
```javascript
// Providers в MongoDB
async function listProviders() {
  const db = getDb()
  return db.collection("providers").find({}).toArray()
}
```

**Надо:** Добавить модель в `prisma/schema.prisma`:
```prisma
model Provider {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  serviceType     String   // "moving_company", "driver", etc.
  rating          Float
  serviceZips     String[] // JSON array or separate table
  pricing         Json     // { baseHourlyRate, helperHourlyRate, ... }
  services        String[] // ["packing", "unpacking", ...]
  status          String   @default("active") // "active", "inactive", "suspended"
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@map("providers")
}
```

**Действия:**
- [ ] Добавить модель `Provider` в schema
- [ ] Создать migration (`prisma migrate dev`)
- [ ] Переписать `server/services/providersDb.js` → использовать Prisma:
  ```javascript
  export async function listProviders(filters = {}) {
    return prisma.provider.findMany({
      where: {
        status: filters.activeOnly !== false ? "active" : undefined,
        serviceType: filters.serviceType || undefined,
      },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
    })
  }
  ```
- [ ] Обновить `server/routes/providers.routes.js` — использовать новый сервис

#### 2.3. Структурировать данные (денормализация или JSON?)
**Вопрос:** `pricing` и `services` в JSON колонках или отдельные таблицы?

**Вариант A: JSON (SIMPLER, сейчас)**
```prisma
model Provider {
  pricing Json // { baseHourlyRate: 55, mileageRate: 1.45 }
  services String[] // ["packing", "unpacking"]
}
```
✅ Быстро  
❌ Сложнее искать (нет индексов внутри JSON)  
❌ Менее гибко для будущего  

**Вариант B: Отдельные таблицы (RECOMMENDED для большого проекта)**
```prisma
model Provider {
  id String @id
  name String
  services ProviderService[]
}

model ProviderService {
  id String @id
  providerId String
  provider Provider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  serviceType String
  price Float
  unit String
}
```
✅ Масштабируемо  
✅ Можно индексировать  
❌ Немного медленнее (JOIN)  

**Рекомендация:** Используйте вариант B если планируется большой проект.

---

### Фаза 3: Добавить недостающие модели (MEDIUM-TERM)

Согласно `discussions/technical-architecture.md`, нужны:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // bcrypt hash
  profile       Json?     // { firstName, lastName, phone, avatar, address }
  roles         Json?     // [{ type: "driver", status: "active", ... }]
  currentRole   String?
  preferences   Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  quotes        HelperQuoteRequest[]
  provider      Provider?
  @@map("users")
}

model Order {
  id            String    @id @default(cuid())
  customerId    String
  customer      User      @relation(fields: [customerId], references: [id], onDelete: Cascade)
  providerId    String?
  type          String    // "moving", "loading", "transport"
  status        String    // "pending", "confirmed", "in-progress", "completed"
  locations     Json      // { pickup: {...}, dropoff: {...} }
  details       Json      // { rooms, volume, weight, specialItems }
  pricing       Json      // { base, distance, labor, total, currency }
  timeline      Json?     // [{ status, timestamp, note }]
  reviews       Json?     // [{ userId, rating, comment }]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  @@map("orders")
}

// Если providers нужны отдельно
model Provider {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  type          String    // "driver", "helper", "company", "agent"
  business      Json      // { name, description, website, licenses }
  services      Json?     // [{ type, price, unit, available }]
  fleet         Json?     // [{ type, capacity, features }]
  ratings       Json?     // { average, count, breakdown }
  availability  Json?
  verification  Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  orders        Order[]
  @@map("providers")
}
```

**Фазирование:**
- Фаза 2: `User`, `Provider` (базовые)
- Фаза 3: `Order` (когда начнёте работать с заказами)
- Фаза 4: `Review`, `Payment`, `AdminAudit` (по мере роста)

---

### Фаза 4: Улучшить обработку ошибок (SHORT-TERM)

**Текущее:** API молчит если БД недоступна

```javascript
// server/services/helperQuoteRequests.js
export async function saveHelperQuoteRequest(request, response) {
  if (!prisma) return null  // ⚠️ Silently fails
  try {
    return await prisma.helperQuoteRequest.create({...})
  } catch (error) {
    console.error("[HolyMove] Failed to save...", error)
    return null  // ⚠️ Silently fails again
  }
}
```

**Надо:**
```javascript
export async function saveHelperQuoteRequest(request, response) {
  if (!prisma) {
    throw new Error("Database not configured: DATABASE_URL not set")
  }
  try {
    return await prisma.helperQuoteRequest.create({...})
  } catch (error) {
    console.error("[HolyMove] Failed to save quote request:", error)
    // Option 1: Throw error (let controller handle)
    throw new Error(`Database error: ${error.message}`)
    // Option 2: Return { success: false, error }
    // Option 3: Retry logic
  }
}
```

**Действия:**
- [ ] Добавить error handling в `server/services/*.js`
- [ ] Создать `server/middleware/errorHandler.js`:
  ```javascript
  export function errorHandler(err, req, res, next) {
    if (err.message.includes("Database")) {
      return res.status(503).json({ error: "Service unavailable", message: err.message })
    }
    return res.status(500).json({ error: "Internal server error" })
  }
  ```
- [ ] Применить в `server/app.js` (последний middleware)
- [ ] Логировать ошибки в БД (для анализа)

---

### Фаза 5: Валидация и Type Safety (MEDIUM-TERM)

**Текущее:** Ручная валидация в routes
```javascript
function validateHelperRequest(req, res, next) {
  const errors = []
  if (!isZip(pickupZip)) errors.push("invalid ZIP")
  // ... много if's
}
```

**Надо:** Использовать Zod + Prisma types

```typescript
// server/validators/helpers.ts
import { z } from "zod"

export const HelperRequestSchema = z.object({
  pickupZip: z.string().regex(/^\d{5}$/),
  dropoffZip: z.string().regex(/^\d{5}$/),
  rooms: z.number().int().min(1).max(10),
  helpers: z.number().int().min(1).max(10),
  volume: z.number().min(1).max(1000),
  date: z.string().datetime(),
})

// server/routes/helpers.routes.js
import { HelperRequestSchema } from "../validators/helpers.ts"

r.post("/", async (req, res, next) => {
  try {
    const validated = HelperRequestSchema.parse(req.body)
    // validated теперь type-safe
    const result = await getHelpers(validated)
    res.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    next(error)
  }
})
```

**Действия:**
- [ ] Добавить `zod` в package.json
- [ ] Создать `server/validators/` с Zod schemas
- [ ] Переписать routes с валидацией
- [ ] Добавить TypeScript поддержку (опционально)

---

## ЧТО МОЖНО СДЕЛАТЬ (NICE-TO-HAVE)

### 1. Database Connection Pooling
```javascript
// server/db/prisma.js — уже использует connection pool
// (PrismaClient встроен, но можно оптимизировать)
```

### 2. Read Replicas (для масштабирования)
```prisma
// PostgreSQL: можно настроить primary → replicas
// Prisma: использовать different DATABASE_URL для reads
```

### 3. Кеширование часто запрашиваемых данных
```javascript
// Redis или Node LRU cache для:
// - списка providers
// - таблицы ЗИП-кодов
// - результатов маршрутов (ORS)
```

### 4. Full-text Search
```prisma
model Provider {
  name String
  description String
  
  @@fulltext([name, description])  // MySQL-specific
}

// Альтернатива: Elasticsearch или Algolia
```

### 5. Audit Trail
```prisma
model AuditLog {
  id String @id @default(cuid())
  entity String     // "Provider", "Order", etc.
  entityId String
  action String     // "CREATE", "UPDATE", "DELETE"
  changedFields Json // { name: { old: "...", new: "..." } }
  userId String?
  createdAt DateTime @default(now())
}
```

### 6. Transaction Support
```javascript
// Перемещение нескольких документов одной транзакцией
await prisma.$transaction([
  prisma.order.create({...}),
  prisma.quote.update({...}),
])
```

### 7. Webhooks / Event System
```javascript
// Когда Order создан → отправить webhook провайдеру
// Когда Quote обновлён → уведомить клиента
```

---

## PLAN OF ACTION (PRIORITIZED)

### **WEEK 1: Cleanup & Foundation**
- [ ] **Day 1-2:** Удалить MongoDB код (Phase 1.1)
- [ ] **Day 2-3:** Стандартизировать env переменные (Phase 1.2)
- [ ] **Day 3:** Убедиться что Prisma работает
- [ ] **Day 4-5:** Добавить Prisma migrations в репо (Phase 2.1)

### **WEEK 2-3: PostgreSQL Migration**
- [ ] Перенести providers в PostgreSQL (Phase 2.2)
- [ ] Проверить, что все API endpoints работают
- [ ] Тестировать на production-подобных данных

### **WEEK 4: Error Handling & Validation**
- [ ] Улучшить error handling (Phase 4)
- [ ] Добавить Zod валидацию (Phase 5)
- [ ] Документировать БД schema

### **AFTER MVP: Scale Phase**
- [ ] Добавить User, Order моделей (Phase 3)
- [ ] Реализовать кеширование (Nice-to-have #3)
- [ ] Настроить monitoring/logging

---

## FILES TO CREATE / MODIFY

```
server/
├── db/
│   └── prisma.js              ✏️ Упростить (убрать MongoDB fallback)
│   └── mongo.js               ❌ УДАЛИТЬ
├── middleware/
│   └── errorHandler.js         🆕 Создать
├── validators/
│   ├── helpers.ts             🆕 Создать (Zod schemas)
│   ├── providers.ts           🆕 Создать
│   └── orders.ts              🆕 Создать (будущее)
├── services/
│   └── providersDb.js         ✏️ Переписать (Prisma вместо MongoDB)
│   └── helperQuoteRequests.js ✏️ Улучшить error handling
│   └── apiRequestLogs.js      ✏️ Улучшить error handling
└── routes/
    └── providers.routes.js    ✏️ Обновить для новой сервис

prisma/
├── schema.prisma              ✏️ Добавить Provider модель
└── migrations/                🆕 Создать (git track!)

.env.example                   ✏️ Упростить env vars

package.json                   ✏️ Удалить mongodb, добавить zod

README.md                       ✏️ Документировать DB setup
```

---

## RISKS & MITIGATION

| Риск | Влияние | Миtigация |
|------|---------|-----------|
| Data loss при миграции с MongoDB | 🔴 Высокое | Полный backup перед миграцией + test migration |
| Production downtime | 🔴 Высокое | Миграция в dev/staging первым, через zero-downtime deployment |
| Неправильная Prisma schema | 🟡 Среднее | Тестировать schema с real data, code review |
| Производительность Prisma ORM | 🟡 Среднее | Профилировать queries, добавить индексы, use raw SQL если нужно |

---

## ЗАКЛЮЧЕНИЕ

**Текущее состояние:** Гибридная система (Prisma + MongoDB) создаёт путаницу и нестабильность.

**Решение:** PostgreSQL-first через Prisma — чисто, масштабируемо, готово к большому проекту.

**Timeline:** 4-6 недель для полной миграции + масштабирования.

**Следующий шаг:** Одобрите план → начните с Phase 1 (Cleanup).

