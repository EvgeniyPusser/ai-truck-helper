import { SERVICE_TYPES, TRANSPORT_MODES } from './database.schema.js';

// Модели для разных типов услуг переезда

export class MovingService {
  constructor(data) {
    this.id = data.id;
    this.provider_id = data.provider_id;
    this.service_name = data.service_name;
    this.service_type = SERVICE_TYPES.MOVING_COMPANY;
    this.description = data.description;
    this.base_price = data.base_price;
    this.price_unit = data.price_unit || 'job';
    this.minimum_price = data.minimum_price;
    this.service_area_radius = data.service_area_radius;
    this.available_features = data.available_features || [];
    this.vehicle_types = data.vehicle_types || [];
    this.transport_modes = data.transport_modes || [TRANSPORT_MODES.ROAD];
    this.max_weight = data.max_weight;
    this.max_volume = data.max_volume;
    this.is_active = data.is_active !== false;
    
    // Специфичные для мувинговых компаний
    this.packing_service = data.packing_service || false;
    this.unpacking_service = data.unpacking_service || false;
    this.storage_available = data.storage_available || false;
    this.insurance_included = data.insurance_included || false;
    this.special_items_handling = data.special_items_handling || [];
  }

  // Расчет базовой стоимости для мувинговой компании
  calculateBaseCost(moveDetails) {
    let cost = this.base_price || 0;
    
    // Дополнительные услуги
    if (this.packing_service && moveDetails.packing_needed) {
      cost += moveDetails.estimated_weight * 0.5; // $0.50 за фунт упаковки
    }
    
    if (this.unpacking_service && moveDetails.unpacking_needed) {
      cost += moveDetails.estimated_weight * 0.3; // $0.30 за фунт распаковки
    }
    
    // Дополнительная страховка
    if (this.insurance_included && moveDetails.additional_insurance) {
      cost += moveDetails.estimated_value * 0.01; // 1% от стоимости
    }
    
    return Math.max(cost, this.minimum_price || 0);
  }

  // Валидация для мувинговой компании
  validate() {
    const errors = [];
    
    if (!this.service_name) errors.push('Service name is required');
    if (!this.provider_id) errors.push('Provider ID is required');
    if (this.base_price && this.base_price < 0) errors.push('Base price must be positive');
    if (this.service_area_radius && this.service_area_radius < 0) {
      errors.push('Service area radius must be positive');
    }
    
    return errors;
  }
}

export class LoadersService {
  constructor(data) {
    this.id = data.id;
    this.provider_id = data.provider_id;
    this.service_name = data.service_name;
    this.service_type = SERVICE_TYPES.LOADERS;
    this.description = data.description;
    this.base_price = data.base_price;
    this.price_unit = data.price_unit || 'hour';
    this.minimum_price = data.minimum_price;
    this.service_area_radius = data.service_area_radius;
    this.available_features = data.available_features || [];
    this.is_active = data.is_active !== false;
    
    // Специфичные для грузчиков
    this.crew_size = data.crew_size || 2;
    this.hourly_rate_per_person = data.hourly_rate_per_person || this.base_price;
    this.minimum_hours = data.minimum_hours || 2;
    this.equipment_available = data.equipment_available || [];
    this.specialized_skills = data.specialized_skills || [];
    this.max_weight_per_person = data.max_weight_per_person || 50; // фунтов
  }

  // Расчет стоимости для грузчиков
  calculateCost(moveDetails) {
    const hours = moveDetails.estimated_hours || this.minimum_hours;
    const crewSize = moveDetails.crew_size || this.crew_size;
    
    let cost = hours * crewSize * this.hourly_rate_per_person;
    
    // Минимальная плата
    const minimumCost = this.minimum_hours * crewSize * this.hourly_rate_per_person;
    cost = Math.max(cost, minimumCost);
    
    // Дополнительно за тяжелые предметы
    if (moveDetails.heavy_items && moveDetails.heavy_items > 0) {
      cost += moveDetails.heavy_items * 50; // $50 за каждый тяжелый предмет
    }
    
    return cost;
  }

  validate() {
    const errors = [];
    
    if (!this.service_name) errors.push('Service name is required');
    if (!this.provider_id) errors.push('Provider ID is required');
    if (this.crew_size < 1) errors.push('Crew size must be at least 1');
    if (this.hourly_rate_per_person < 0) errors.push('Hourly rate must be positive');
    if (this.minimum_hours < 1) errors.push('Minimum hours must be at least 1');
    
    return errors;
  }
}

export class DriversService {
  constructor(data) {
    this.id = data.id;
    this.provider_id = data.provider_id;
    this.service_name = data.service_name;
    this.service_type = SERVICE_TYPES.DRIVERS;
    this.description = data.description;
    this.base_price = data.base_price;
    this.price_unit = data.price_unit || 'mile';
    this.minimum_price = data.minimum_price;
    this.service_area_radius = data.service_area_radius;
    this.available_features = data.available_features || [];
    this.is_active = data.is_active !== false;
    
    // Специфичные для шоферов
    this.vehicle_types = data.vehicle_types || [];
    this.license_class = data.license_class || 'C';
    this.years_of_experience = data.years_of_experience || 0;
    this.max_distance = data.max_distance || 1000; // миль
    this.per_mile_rate = data.per_mile_rate || this.base_price;
    this.hourly_rate = data.hourly_rate;
    this.can_load_unload = data.can_load_unload || false;
  }

  // Расчет стоимости для шофера
  calculateCost(moveDetails) {
    let cost = 0;
    const distance = moveDetails.distance || 0;
    
    if (this.price_unit === 'mile') {
      cost = distance * this.per_mile_rate;
    } else if (this.price_unit === 'hour' && this.hourly_rate) {
      const estimatedHours = distance / 50; // средняя скорость 50 миль/час
      cost = estimatedHours * this.hourly_rate;
    }
    
    // Минимальная плата
    cost = Math.max(cost, this.minimum_price || 0);
    
    // Дополнительно за погрузку/разгрузку
    if (this.can_load_unload && moveDetails.loading_unloading_needed) {
      cost += 100; // $100 за погрузку/разгрузку
    }
    
    return cost;
  }

  validate() {
    const errors = [];
    
    if (!this.service_name) errors.push('Service name is required');
    if (!this.provider_id) errors.push('Provider ID is required');
    if (this.vehicle_types.length === 0) errors.push('At least one vehicle type required');
    if (this.per_mile_rate && this.per_mile_rate < 0) errors.push('Per mile rate must be positive');
    if (this.hourly_rate && this.hourly_rate < 0) errors.push('Hourly rate must be positive');
    
    return errors;
  }
}

export class TruckRentalService {
  constructor(data) {
    this.id = data.id;
    this.provider_id = data.provider_id;
    this.service_name = data.service_name;
    this.service_type = SERVICE_TYPES.TRUCK_RENTAL;
    this.description = data.description;
    this.base_price = data.base_price;
    this.price_unit = data.price_unit || 'day';
    this.minimum_price = data.minimum_price;
    this.service_area_radius = data.service_area_radius;
    this.available_features = data.available_features || [];
    this.is_active = data.is_active !== false;
    
    // Специфичные для аренды грузовиков
    this.truck_types = data.truck_types || [];
    this.daily_rate = data.daily_rate || this.base_price;
    this.weekly_rate = data.weekly_rate;
    this.monthly_rate = data.monthly_rate;
    this.mileage_included = data.mileage_included || 0;
    this.per_mile_charge = data.per_mile_charge || 0;
    this.deposit_required = data.deposit_required || 0;
    this.insurance_required = data.insurance_required || false;
    this.insurance_daily_rate = data.insurance_daily_rate || 0;
    this.min_rental_days = data.min_rental_days || 1;
    this.max_rental_days = data.max_rental_days || 30;
  }

  // Расчет стоимости аренды
  calculateCost(rentalDetails) {
    const days = rentalDetails.days || 1;
    const mileage = rentalDetails.mileage || 0;
    let cost = 0;
    
    // Расчет стоимости по дням
    if (days >= 30 && this.monthly_rate) {
      cost = this.monthly_rate;
    } else if (days >= 7 && this.weekly_rate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      cost = weeks * this.weekly_rate + remainingDays * this.daily_rate;
    } else {
      cost = days * this.daily_rate;
    }
    
    // Дополнительные мили
    const extraMileage = Math.max(0, mileage - this.mileage_included);
    cost += extraMileage * this.per_mile_charge;
    
    // Страховка
    if (this.insurance_required || rentalDetails.insurance_requested) {
      cost += days * this.insurance_daily_rate;
    }
    
    return Math.max(cost, this.minimum_price || 0);
  }

  validate() {
    const errors = [];
    
    if (!this.service_name) errors.push('Service name is required');
    if (!this.provider_id) errors.push('Provider ID is required');
    if (this.truck_types.length === 0) errors.push('At least one truck type required');
    if (this.daily_rate && this.daily_rate < 0) errors.push('Daily rate must be positive');
    if (this.min_rental_days < 1) errors.push('Minimum rental days must be at least 1');
    if (this.max_rental_days < this.min_rental_days) {
      errors.push('Maximum rental days must be greater than minimum');
    }
    
    return errors;
  }
}

export class ContainerService {
  constructor(data) {
    this.id = data.id;
    this.provider_id = data.provider_id;
    this.service_name = data.service_name;
    this.service_type = SERVICE_TYPES.CONTAINER;
    this.description = data.description;
    this.base_price = data.base_price;
    this.price_unit = data.price_unit || 'job';
    this.minimum_price = data.minimum_price;
    this.service_area_radius = data.service_area_radius;
    this.available_features = data.available_features || [];
    this.transport_modes = data.transport_modes || [TRANSPORT_MODES.ROAD];
    this.is_active = data.is_active !== false;
    
    // Специфичные для контейнерных перевозок
    this.container_sizes = data.container_sizes || []; // 20ft, 40ft, etc.
    this.transport_mode = data.transport_mode || TRANSPORT_MODES.ROAD;
    this.rail_rates = data.rail_rates || {};
    this.sea_rates = data.sea_rates || {};
    this.road_rates = data.road_rates || {};
    this.loading_fee = data.loading_fee || 0;
    this.unloading_fee = data.unloading_fee || 0;
    this.customs_handling = data.customs_handling || false;
    this.warehousing_available = data.warehousing_available || false;
    this.tracking_available = data.tracking_available || false;
  }

  // Расчет стоимости контейнерной перевозки
  calculateCost(shippingDetails) {
    const containerSize = shippingDetails.container_size;
    const distance = shippingDetails.distance || 0;
    const transportMode = shippingDetails.transport_mode || this.transport_mode;
    
    let cost = 0;
    
    // Базовая стоимость в зависимости от транспорта
    if (transportMode === TRANSPORT_MODES.RAIL && this.rail_rates[containerSize]) {
      cost = this.rail_rates[containerSize] + (distance * 0.1); // $0.10 за милю ж/д
    } else if (transportMode === TRANSPORT_MODES.SEA && this.sea_rates[containerSize]) {
      cost = this.sea_rates[containerSize]; // морские перевозки фиксированная цена
    } else if (transportMode === TRANSPORT_MODES.ROAD && this.road_rates[containerSize]) {
      cost = this.road_rates[containerSize] + (distance * 2); // $2 за милю авто
    } else {
      cost = this.base_price || 0;
    }
    
    // Погрузка/разгрузка
    if (shippingDetails.loading_needed) {
      cost += this.loading_fee;
    }
    if (shippingDetails.unloading_needed) {
      cost += this.unloading_fee;
    }
    
    // Таможенное оформление
    if (this.customs_handling && shippingDetails.customs_needed) {
      cost += 500; // $500 за таможенное оформление
    }
    
    return Math.max(cost, this.minimum_price || 0);
  }

  validate() {
    const errors = [];
    
    if (!this.service_name) errors.push('Service name is required');
    if (!this.provider_id) errors.push('Provider ID is required');
    if (this.container_sizes.length === 0) errors.push('At least one container size required');
    if (!Object.values(TRANSPORT_MODES).includes(this.transport_mode)) {
      errors.push('Invalid transport mode');
    }
    
    return errors;
  }
}

export class BrokerService {
  constructor(data) {
    this.id = data.id;
    this.provider_id = data.provider_id;
    this.service_name = data.service_name;
    this.service_type = SERVICE_TYPES.BROKER;
    this.description = data.description;
    this.base_price = data.base_price;
    this.price_unit = data.price_unit || 'job';
    this.minimum_price = data.minimum_price;
    this.service_area_radius = data.service_area_radius;
    this.available_features = data.available_features || [];
    this.is_active = data.is_active !== false;
    
    // Специфичные для посредников
    this.commission_rate = data.commission_rate || 0.1; // 10% комиссия
    this.network_size = data.network_size || 0;
    this.specializations = data.specializations || [];
    this.verification_process = data.verification_process || '';
    this.dispute_resolution = data.dispute_resolution || false;
    this.insurance_brokerage = data.insurance_brokerage || false;
    this.consultation_fee = data.consultation_fee || 0;
  }

  // Расчет стоимости услуг посредника
  calculateCost(serviceDetails) {
    let cost = 0;
    
    // Консультационный сбор
    if (serviceDetails.consultation_needed) {
      cost += this.consultation_fee;
    }
    
    // Комиссия от стоимости сделки
    if (serviceDetails.total_value) {
      cost += serviceDetails.total_value * this.commission_rate;
    }
    
    // Дополнительные услуги
    if (this.insurance_brokerage && serviceDetails.insurance_brokerage_needed) {
      cost += 200; // $200 за страховое брокерство
    }
    
    return Math.max(cost, this.minimum_price || 0);
  }

  validate() {
    const errors = [];
    
    if (!this.service_name) errors.push('Service name is required');
    if (!this.provider_id) errors.push('Provider ID is required');
    if (this.commission_rate < 0 || this.commission_rate > 1) {
      errors.push('Commission rate must be between 0 and 1');
    }
    if (this.consultation_fee < 0) errors.push('Consultation fee must be positive');
    
    return errors;
  }
}

// Фабрика для создания сервисов
export class ServiceFactory {
  static createService(data) {
    switch (data.service_type) {
      case SERVICE_TYPES.MOVING_COMPANY:
        return new MovingService(data);
      case SERVICE_TYPES.LOADERS:
        return new LoadersService(data);
      case SERVICE_TYPES.DRIVERS:
        return new DriversService(data);
      case SERVICE_TYPES.TRUCK_RENTAL:
        return new TruckRentalService(data);
      case SERVICE_TYPES.CONTAINER:
        return new ContainerService(data);
      case SERVICE_TYPES.BROKER:
        return new BrokerService(data);
      default:
        throw new Error(`Unknown service type: ${data.service_type}`);
    }
  }
  
  static getServiceTypes() {
    return Object.values(SERVICE_TYPES);
  }
  
  static getTransportModes() {
    return Object.values(TRANSPORT_MODES);
  }
}

export default {
  MovingService,
  LoadersService,
  DriversService,
  TruckRentalService,
  ContainerService,
  BrokerService,
  ServiceFactory,
  SERVICE_TYPES,
  TRANSPORT_MODES
};
