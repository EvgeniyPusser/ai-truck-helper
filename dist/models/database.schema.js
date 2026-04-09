// Архитектура базы данных для Holy Move - платформы переездов
export const SERVICE_TYPES = {
    MOVING_COMPANY: 'moving_company', // Мувинговые компании (под ключ)
    LOADERS: 'loaders', // Грузчики
    DRIVERS: 'drivers', // Шоферы
    TRUCK_RENTAL: 'truck_rental', // Аренда грузовиков
    CONTAINER: 'container', // Контейнерные перевозки
    BROKER: 'broker' // Посредники
};
export const TRANSPORT_MODES = {
    ROAD: 'road', // Автомобильный
    RAIL: 'rail', // Ж/д
    SEA: 'sea', // Морской
    AIR: 'air' // Воздушный
};
// Основные таблицы
// Пользователи системы
export const UserSchema = {
    id: 'UUID PRIMARY KEY',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password_hash: 'VARCHAR(255) NOT NULL',
    first_name: 'VARCHAR(100)',
    last_name: 'VARCHAR(100)',
    phone: 'VARCHAR(20)',
    role: 'ENUM("customer", "provider", "admin") DEFAULT "customer"',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Исполнители услуг (компании и частные лица)
export const ProviderSchema = {
    id: 'UUID PRIMARY KEY',
    user_id: 'UUID REFERENCES User(id)',
    company_name: 'VARCHAR(255)',
    service_type: 'ENUM("moving_company", "loaders", "drivers", "truck_rental", "container", "broker") NOT NULL',
    description: 'TEXT',
    website: 'VARCHAR(255)',
    logo_url: 'VARCHAR(500)',
    license_number: 'VARCHAR(100)',
    insurance_info: 'JSONB',
    service_areas: 'JSONB',
    years_in_business: 'INTEGER',
    employees_count: 'INTEGER',
    is_verified: 'BOOLEAN DEFAULT false',
    verification_documents: 'JSONB',
    average_rating: 'DECIMAL(3,2) DEFAULT 0',
    total_reviews: 'INTEGER DEFAULT 0',
    completed_jobs: 'INTEGER DEFAULT 0',
    status: 'ENUM("active", "inactive", "suspended") DEFAULT "active"',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Услуги, предоставляемые исполнителями
export const ServiceSchema = {
    id: 'UUID PRIMARY KEY',
    provider_id: 'UUID REFERENCES Provider(id)',
    service_name: 'VARCHAR(255) NOT NULL',
    service_type: 'ENUM("moving_company", "loaders", "drivers", "truck_rental", "container", "broker") NOT NULL',
    description: 'TEXT',
    base_price: 'DECIMAL(10,2)',
    price_unit: 'ENUM("hour", "day", "job", "mile", "pound")',
    minimum_price: 'DECIMAL(10,2)',
    service_area_radius: 'INTEGER',
    available_features: 'JSONB',
    vehicle_types: 'JSONB',
    transport_modes: 'JSONB',
    max_weight: 'INTEGER',
    max_volume: 'INTEGER',
    is_active: 'BOOLEAN DEFAULT true',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Запросы на переезд
export const MoveRequestSchema = {
    id: 'UUID PRIMARY KEY',
    customer_id: 'UUID REFERENCES User(id)',
    pickup_zip: 'VARCHAR(5) NOT NULL',
    dropoff_zip: 'VARCHAR(5) NOT NULL',
    pickup_address: 'TEXT',
    dropoff_address: 'TEXT',
    pickup_date: 'DATE NOT NULL',
    flexible_dates: 'BOOLEAN DEFAULT false',
    move_size: 'ENUM("studio", "1_bedroom", "2_bedroom", "3_bedroom", "4_bedroom", "5_plus_bedroom")',
    rooms_count: 'INTEGER',
    square_footage: 'INTEGER',
    estimated_weight: 'INTEGER',
    special_items: 'JSONB',
    services_needed: 'JSONB',
    budget_range: 'JSONB',
    access_info: 'JSONB',
    timeline: 'ENUM("urgent", "flexible", "planned")',
    distance: 'INTEGER',
    transport_mode: 'ENUM("road", "rail", "sea", "air") DEFAULT "road"',
    status: 'ENUM("draft", "published", "in_progress", "completed", "cancelled") DEFAULT "draft"',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Предложения от исполнителей
export const QuoteSchema = {
    id: 'UUID PRIMARY KEY',
    move_request_id: 'UUID REFERENCES MoveRequest(id)',
    provider_id: 'UUID REFERENCES Provider(id)',
    total_price: 'DECIMAL(10,2) NOT NULL',
    price_breakdown: 'JSONB',
    estimated_duration: 'INTEGER',
    available_dates: 'JSONB',
    services_included: 'JSONB',
    vehicle_info: 'JSONB',
    crew_size: 'INTEGER',
    insurance_coverage: 'JSONB',
    terms: 'TEXT',
    valid_until: 'DATE',
    status: 'ENUM("pending", "accepted", "rejected", "expired") DEFAULT "pending"',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Отзывы и рейтинги
export const ReviewSchema = {
    id: 'UUID PRIMARY KEY',
    move_request_id: 'UUID REFERENCES MoveRequest(id)',
    provider_id: 'UUID REFERENCES Provider(id)',
    customer_id: 'UUID REFERENCES User(id)',
    rating: 'INTEGER CHECK (rating >= 1 AND rating <= 5)',
    title: 'VARCHAR(255)',
    comment: 'TEXT',
    pros: 'JSONB',
    cons: 'JSONB',
    would_recommend: 'BOOLEAN',
    price_fairness: 'INTEGER CHECK (price_fairness >= 1 AND price_fairness <= 5)',
    communication_quality: 'INTEGER CHECK (communication_quality >= 1 AND communication_quality <= 5)',
    timeliness: 'INTEGER CHECK (timeliness >= 1 AND timeliness <= 5)',
    professionalism: 'INTEGER CHECK (professionalism >= 1 AND professionalism <= 5)',
    photos: 'JSONB',
    verified_purchase: 'BOOLEAN DEFAULT true',
    is_public: 'BOOLEAN DEFAULT true',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Психологическая поддержка - история переезда
export const MoveStorySchema = {
    id: 'UUID PRIMARY KEY',
    customer_id: 'UUID REFERENCES User(id)',
    move_request_id: 'UUID REFERENCES MoveRequest(id)',
    title: 'VARCHAR(255)',
    story_content: 'TEXT',
    family_members: 'JSONB',
    memories: 'JSONB',
    challenges: 'JSONB',
    achievements: 'JSONB',
    ai_companion_interactions: 'JSONB',
    emotional_state: 'JSONB',
    milestones: 'JSONB',
    is_public: 'BOOLEAN DEFAULT false',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// AI взаимодействия для психологической поддержки
export const AIInteractionSchema = {
    id: 'UUID PRIMARY KEY',
    customer_id: 'UUID REFERENCES User(id)',
    move_story_id: 'UUID REFERENCES MoveStory(id)',
    session_id: 'UUID',
    user_message: 'TEXT',
    ai_response: 'TEXT',
    intent: 'ENUM("emotional_support", "practical_advice", "memory_preservation", "stress_relief")',
    sentiment_score: 'DECIMAL(3,2)',
    emotional_tags: 'JSONB',
    follow_up_actions: 'JSONB',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Надежность и профессионализм исполнителей
export const ProviderReliabilitySchema = {
    id: 'UUID PRIMARY KEY',
    provider_id: 'UUID REFERENCES Provider(id)',
    on_time_rate: 'DECIMAL(3,2)',
    completion_rate: 'DECIMAL(3,2)',
    damage_rate: 'DECIMAL(3,2)',
    customer_satisfaction_score: 'DECIMAL(3,2)',
    response_time_avg: 'INTEGER',
    dispute_resolution_rate: 'DECIMAL(3,2)',
    insurance_claim_rate: 'DECIMAL(3,2)',
    reliability_score: 'DECIMAL(3,2)',
    professionalism_score: 'DECIMAL(3,2)',
    last_calculated: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
// Географические данные для расчетов
export const ZipCodeDataSchema = {
    zip: 'VARCHAR(5) PRIMARY KEY',
    city: 'VARCHAR(100)',
    state: 'VARCHAR(2)',
    latitude: 'DECIMAL(10,8)',
    longitude: 'DECIMAL(11,8)',
    population: 'INTEGER',
    density: 'INTEGER',
    average_home_price: 'DECIMAL(12,2)',
    cost_of_living_index: 'INTEGER',
    region: 'VARCHAR(50)'
};
export default {
    SERVICE_TYPES,
    TRANSPORT_MODES,
    UserSchema,
    ProviderSchema,
    ServiceSchema,
    MoveRequestSchema,
    QuoteSchema,
    ReviewSchema,
    MoveStorySchema,
    AIInteractionSchema,
    ProviderReliabilitySchema,
    ZipCodeDataSchema
};
