// server/services/providers.js
// Функция принимает объект с параметрами от фронта
import fs from "fs";
import path from "path";
// Load trucks.json once
const trucksPath = path.resolve("server/data/trucks.json");
const trucks = JSON.parse(fs.readFileSync(trucksPath, "utf-8"));

// Estimate volume by rooms (can be overridden by user)
function estimateVolumeByRooms(rooms) {
  // Studio: 7, 1br: 12, 2br: 20, 3br: 30, 4br: 40, 5br+: 50
  if (rooms <= 0) return 7;
  if (rooms === 1) return 12;
  if (rooms === 2) return 20;
  if (rooms === 3) return 30;
  if (rooms === 4) return 40;
  return 50;
}

// Smart truck selection by volume and rooms
function selectTruckSmart(rooms, volume, weight) {
  // If volume not set, estimate by rooms
  const v =
    typeof volume === "number" && volume > 0
      ? volume
      : estimateVolumeByRooms(rooms);
  // Find the smallest truck that fits both volume and weight
  return (
    trucks.find((t) => v <= t.volume_m3 && weight <= t.max_weight_kg) ||
    trucks.find((t) => v <= t.volume_m3) ||
    trucks[trucks.length - 1]
  );
}

// (removed unused selectTruck)

function getTruckTypeEn(truck) {
  // Use truck.name from trucks.json, fallback to id if missing
  return truck?.name || truck?.id || "Unknown Truck";
}

function getTruckDescriptionEn(truck) {
  return truck?.description || "Truck details not available.";
}

// Calculate realistic distance (mock data for now - can be replaced with real API later)
function calculateDistance(pickupZip, dropoffZip) {
  // Mock distance calculation based on ZIP difference
  const pickup = parseInt(pickupZip);
  const dropoff = parseInt(dropoffZip);
  const zipDiff = Math.abs(pickup - dropoff);
  
  // Rough distance estimation in miles
  let distance;
  if (zipDiff < 100) distance = 5 + Math.random() * 15; // 5-20 miles for nearby zips
  else if (zipDiff < 1000) distance = 20 + Math.random() * 80; // 20-100 miles
  else if (zipDiff < 5000) distance = 100 + Math.random() * 200; // 100-300 miles
  else distance = 300 + Math.random() * 1000; // 300-1300 miles for cross-country
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

// Calculate moving time estimate
function calculateMovingTime(rooms, volume, distance) {
  // Base packing/loading time by rooms
  let packingTime = 0;
  if (rooms <= 1) packingTime = 2;
  else if (rooms <= 2) packingTime = 3;
  else if (rooms <= 3) packingTime = 4.5;
  else if (rooms <= 4) packingTime = 6;
  else packingTime = 8;
  
  // Driving time (assuming 45 mph average with stops)
  const drivingTime = distance / 45;
  
  // Unloading time (usually 70% of packing time)
  const unloadingTime = packingTime * 0.7;
  
  const totalTime = packingTime + drivingTime + unloadingTime;
  return Math.round(totalTime * 10) / 10;
}

export async function findHelpers(params) {
  const { pickupZip, dropoffZip, helpers, volume, rooms, date } = params;
  
  // Calculate distance and time
  const distance = calculateDistance(pickupZip, dropoffZip);
  const estimatedTime = calculateMovingTime(rooms, volume, distance);
  
  // Base hourly rate
  let baseHourlyRate = 35; // Updated to more realistic rate
  
  // Weekend surcharge
  const moveDate = new Date(date);
  const weekend = ["Sat", "Sun"].includes(
    moveDate.toLocaleString("en-US", { weekday: "short" })
  );
  if (weekend) baseHourlyRate = Math.round(baseHourlyRate * 1.15);
  
  // Major city surcharge
  const majorZips = ["10001", "90001", "60601", "77001", "33101", "19101", "02101", "20001"];
  const isMajorCity = majorZips.includes(pickupZip) || majorZips.includes(dropoffZip);
  if (isMajorCity) baseHourlyRate = Math.round(baseHourlyRate * 1.2);
  
  // Calculate base labor cost
  const helperCount = helpers || 2;
  const baseLaborCost = Math.round(baseHourlyRate * helperCount * estimatedTime);
  
  // Truck rental cost (based on distance and truck type)
  const estWeight = rooms * 200; // kg per room
  const truck = selectTruckSmart(rooms, volume, estWeight);
  
  let truckDailyCost;
  switch(truck.id) {
    case 'van': truckDailyCost = 29.95; break;
    case 'sprinter': truckDailyCost = 39.95; break;
    case 'small_box': truckDailyCost = 49.95; break;
    case 'medium_box': truckDailyCost = 69.95; break;
    case 'large_box': truckDailyCost = 89.95; break;
    default: truckDailyCost = 49.95;
  }
  
  // Mileage cost ($1.29 per mile is typical)
  const mileageCost = Math.round(distance * 1.29);
  const truckTotalCost = Math.round(truckDailyCost + mileageCost);
  
  // Additional services
  const packingMaterialsCost = Math.round(volume * 8); // $8 per cubic meter
  const insuranceCost = Math.round((baseLaborCost + truckTotalCost) * 0.03); // 3% of total
  
  // Fuel surcharge
  const fuelSurcharge = Math.round(distance * 0.85); // $0.85 per mile
  
  // Total cost calculation
  const subtotal = baseLaborCost + truckTotalCost + packingMaterialsCost + fuelSurcharge;
  const taxRate = 0.08; // 8% tax
  const taxes = Math.round(subtotal * taxRate);
  const totalCost = subtotal + taxes + insuranceCost;
  
  // Cost breakdown for detailed view
  const costBreakdown = {
    laborCost: baseLaborCost,
    truckRental: Math.round(truckDailyCost),
    mileageFee: mileageCost,
    packingMaterials: packingMaterialsCost,
    fuelSurcharge: fuelSurcharge,
    insurance: insuranceCost,
    taxes: taxes,
    subtotal: subtotal,
    total: totalCost
  };
  
  // Generate helpers with slight price variations
  const helpers_data = [
    {
      id: "h1",
      name: "Michael Rodriguez",
      rating: 4.8,
      experience: "5 years",
      specialties: ["Furniture Assembly", "Fragile Items", "Piano Moving"],
      rate: totalCost,
      hourlyRate: baseHourlyRate,
      source: "TopMovers Pro",
      pickupZip,
      dropoffZip,
      distance: distance,
      estimatedTime: estimatedTime,
      helperCount: helperCount,
      truck: {
        id: truck?.id,
        name: getTruckTypeEn(truck),
        volume_m3: truck?.volume_m3,
        max_weight_kg: truck?.max_weight_kg,
        description: getTruckDescriptionEn(truck),
        dailyRate: Math.round(truckDailyCost),
        mileageRate: 1.29
      },
      costBreakdown,
      services: {
        packing: true,
        unpacking: true,
        furniture_assembly: true,
        storage: false
      },
      availability: "Available",
      phone: "(555) 123-4567"
    },
    {
      id: "h2", 
      name: "Sarah Chen",
      rating: 4.9,
      experience: "7 years",
      specialties: ["Apartment Moves", "Office Relocation", "Senior Moving"],
      rate: Math.round(totalCost * 0.95), // 5% lower
      hourlyRate: Math.round(baseHourlyRate * 0.95),
      source: "Elite Movers",
      pickupZip,
      dropoffZip,
      distance: distance,
      estimatedTime: estimatedTime,
      helperCount: helperCount,
      truck: {
        id: truck?.id,
        name: getTruckTypeEn(truck),
        volume_m3: truck?.volume_m3,
        max_weight_kg: truck?.max_weight_kg,
        description: getTruckDescriptionEn(truck),
        dailyRate: Math.round(truckDailyCost),
        mileageRate: 1.29
      },
      costBreakdown: {
        ...costBreakdown,
        laborCost: Math.round(costBreakdown.laborCost * 0.95),
        total: Math.round(totalCost * 0.95)
      },
      services: {
        packing: true,
        unpacking: true,
        furniture_assembly: false,
        storage: true
      },
      availability: "Available",
      phone: "(555) 987-6543"
    },
    {
      id: "h3",
      name: "David Thompson",
      rating: 4.6,
      experience: "3 years", 
      specialties: ["Local Moves", "Student Housing", "Same Day Service"],
      rate: Math.round(totalCost * 1.08), // 8% higher but faster service
      hourlyRate: Math.round(baseHourlyRate * 1.1),
      source: "QuickMove Express",
      pickupZip,
      dropoffZip,
      distance: distance,
      estimatedTime: Math.round(estimatedTime * 0.9 * 10) / 10, // 10% faster
      helperCount: helperCount,
      truck: {
        id: truck?.id,
        name: getTruckTypeEn(truck),
        volume_m3: truck?.volume_m3,
        max_weight_kg: truck?.max_weight_kg,
        description: getTruckDescriptionEn(truck),
        dailyRate: Math.round(truckDailyCost),
        mileageRate: 1.29
      },
      costBreakdown: {
        ...costBreakdown,
        laborCost: Math.round(costBreakdown.laborCost * 1.1),
        total: Math.round(totalCost * 1.08)
      },
      services: {
        packing: false,
        unpacking: false,
        furniture_assembly: true,
        storage: false
      },
      availability: "Available Today",
      phone: "(555) 456-7890"
    }
  ];
  
  return helpers_data;
}
