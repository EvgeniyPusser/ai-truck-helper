# Техническая архитектура - Holy Move

## Стек технологий

### Frontend
- **Framework:** React 18+ с hooks
- **UI Library:** Chakra UI (уже используется)
- **Routing:** React Router v6
- **State Management:** React Context + useReducer
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Styling:** Chakra UI + custom CSS
- **Build Tool:** Vite (быстрее чем Create React App)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose (гибкость)
- **Authentication:** JWT + bcrypt
- **Validation:** Joi/Zod
- **File Storage:** AWS S3 или Cloudinary
- **Caching:** Redis
- **Logging:** Winston

### Infrastructure
- **Deployment:** Docker + AWS/Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (errors), LogRocket (user sessions)
- **Analytics:** Google Analytics + custom dashboard

## Архитектурные паттерны

### 1. Feature-based организация
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   ├── orders/
│   ├── providers/
│   └── dashboard/
```

### 2. Domain-driven design (DDD)
```
domains/
├── user/
│   ├── entities/
│   ├── services/
│   ├── repositories/
│   └── controllers/
├── order/
├── provider/
└── payment/
```

### 3. Clean Architecture
```
src/
├── presentation/     # UI components
├── application/      # Use cases
├── domain/         # Business logic
└── infrastructure/  # External services
```

## API Design

### RESTful endpoints
```
# Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/profile

# Users
GET    /api/users/me
PUT    /api/users/me
DELETE  /api/users/me

# Orders
GET    /api/orders
POST    /api/orders
GET     /api/orders/:id
PUT     /api/orders/:id
DELETE   /api/orders/:id

# Providers
GET     /api/providers
POST     /api/providers
GET      /api/providers/:id
PUT      /api/providers/:id
DELETE    /api/providers/:id

# Search
GET      /api/search/providers
GET      /api/search/orders
POST     /api/search/route

# AI/ML
POST     /api/ai/optimize
POST     /api/ai/recommend
POST     /api/ai/chat
```

### GraphQL альтернатива
```graphql
type Query {
  user(id: ID!): User
  orders(filter: OrderFilter): [Order]
  providers(filter: ProviderFilter): [Provider]
  search(query: String!): SearchResult
}

type Mutation {
  createOrder(input: OrderInput!): Order
  updateOrder(id: ID!, input: OrderInput!): Order
  login(email: String!, password: String!): AuthPayload
}
```

## Database Schema

### MongoDB Collections
```javascript
// Users
{
  _id: ObjectId,
  email: String,
  password: String,
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String,
    address: Object
  },
  roles: [{
    type: String, // 'driver', 'helper', 'company', 'agent'
    status: String, // 'active', 'pending', 'suspended'
    verified: Boolean,
    data: Object // role-specific data
  }],
  currentRole: String,
  preferences: {
    notifications: Object,
    language: String,
    timezone: String
  },
  createdAt: Date,
  updatedAt: Date
}

// Orders
{
  _id: ObjectId,
  customerId: ObjectId,
  providerId: ObjectId,
  type: String, // 'moving', 'loading', 'transport'
  status: String, // 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'
  locations: {
    pickup: { address: String, coordinates: [Number], zip: String },
    dropoff: { address: String, coordinates: [Number], zip: String }
  },
  details: {
    rooms: Number,
    volume: Number,
    weight: Number,
    specialItems: [String],
    notes: String
  },
  pricing: {
    base: Number,
    distance: Number,
    labor: Number,
    total: Number,
    currency: String
  },
  timeline: [{
    status: String,
    timestamp: Date,
    note: String
  }],
  reviews: [{
    userId: ObjectId,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

// Providers
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'driver', 'helper', 'company', 'agent'
  business: {
    name: String,
    description: String,
    website: String,
    phone: String,
    email: String,
    address: Object,
    licenses: [String]
  },
  services: [{
    type: String,
    price: Number,
    unit: String, // 'hour', 'flat', 'mile'
    available: Boolean
  }],
  fleet: [{
    type: String, // 'truck', 'van', 'car'
    capacity: Number,
    features: [String]
  }],
  team: [{
    userId: ObjectId,
    role: String,
    status: String
  }],
  ratings: {
    average: Number,
    count: Number,
    breakdown: Object
  },
  availability: {
    schedule: Object,
    timezone: String,
    notice: Number
  },
  verification: {
    documents: [String],
    status: String, // 'pending', 'verified', 'rejected'
    verifiedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Security

### Authentication & Authorization
```javascript
// JWT Structure
{
  sub: userId,
  role: currentRole,
  permissions: [],
  iat: timestamp,
  exp: timestamp
}

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Data Validation
```javascript
// Zod schemas
const orderSchema = z.object({
  customerId: z.string().min(1),
  locations: z.object({
    pickup: z.object({
      address: z.string().min(1),
      zip: z.string().regex(/^\d{5}$/)
    }),
    dropoff: z.object({
      address: z.string().min(1),
      zip: z.string().regex(/^\d{5}$/)
    })
  }),
  details: z.object({
    rooms: z.number().min(0),
    volume: z.number().min(0)
  })
});
```

## Performance

### Frontend Optimization
- **Code Splitting:** React.lazy + Suspense
- **Bundle Size:** Tree shaking, dynamic imports
- **Images:** WebP, lazy loading, CDN
- **Caching:** Service worker, HTTP cache
- **Monitoring:** Web Vitals, Sentry

### Backend Optimization
- **Database:** Indexes, aggregation pipelines
- **Caching:** Redis for frequent queries
- **API:** Pagination, rate limiting
- **File Storage:** CDN, compression

## Scalability

### Horizontal Scaling
```
Load Balancer → Multiple App Servers → Shared Database
                ↓
              Redis Cluster
```

### Microservices Path
```
API Gateway → Auth Service → Order Service → Provider Service
            ↓              ↓               ↓
         User DB        Order DB        Provider DB
```

## Testing Strategy

### Frontend
- **Unit:** Jest + React Testing Library
- **Integration:** Cypress
- **E2E:** Playwright
- **Visual:** Storybook + Chromatic

### Backend
- **Unit:** Jest + Supertest
- **Integration:** Test containers
- **Load:** Artillery/k6
- **Security:** OWASP ZAP

## Deployment Pipeline

### CI/CD Workflow
```yaml
name: Deploy
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Run E2E
        run: npm run test:e2e
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: npm run deploy
```

## Monitoring & Observability

### Metrics
- **Application:** Response time, error rate, throughput
- **Business:** Orders per day, conversion rate, user retention
- **Infrastructure:** CPU, memory, disk, network

### Logging
```javascript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Questions для обсуждения

1. **Какую базу выбрать?** MongoDB vs PostgreSQL
2. **REST vs GraphQL?** Какой API подход?
3. **Микросервисы или монолит?** Учитывая размер проекта
4. **Какой уровень тестирования нужен?** MVP vs production-ready
5. **Где развертывать?** AWS, Vercel, DigitalOcean?
6. **Какая стратегия кеширования?** Redis, Memcached, CDN?
