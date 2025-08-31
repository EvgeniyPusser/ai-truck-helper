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

export async function findHelpers(params) {
  const { pickupZip, dropoffZip, helpers, volume, rooms, date } = params;
  // ...existing code...
  // ...existing code...
  let baseRate = 28;
  const weekend = ["Sat", "Sun"].includes(
    new Date(date).toLocaleString("en-US", { weekday: "short" })
  );
  let rate = weekend ? Math.round(baseRate * 1.1) : baseRate;
  const majorZips = ["10001", "90001", "60601"];
  if (majorZips.includes(pickupZip) || majorZips.includes(dropoffZip)) {
    rate = Math.round(rate * 1.15);
  }
  if (helpers > 2) rate += (helpers - 2) * 5;
  if (volume > 20) rate += Math.floor((volume - 20) / 10) * 10;

  // Estimate weight if not provided (assume 200kg per room as a placeholder)
  const estWeight = typeof helpers === "number" ? helpers * 200 : 1000;
  // Use smart truck selection
  const truck = selectTruckSmart(rooms, volume, estWeight);
  return [
    {
      id: "h1",
      name: "John Doe",
      rate,
      source: "Stat",
      pickupZip,
      dropoffZip,
      truck: {
        id: truck?.id,
        name: getTruckTypeEn(truck),
        volume_m3: truck?.volume_m3,
        max_weight_kg: truck?.max_weight_kg,
        description: getTruckDescriptionEn(truck),
      },
    },
    {
      id: "h2",
      name: "Mike Smith",
      rate: rate + 2,
      source: "Stat",
      pickupZip,
      dropoffZip,
      truck: {
        id: truck?.id,
        name: getTruckTypeEn(truck),
        volume_m3: truck?.volume_m3,
        max_weight_kg: truck?.max_weight_kg,
        description: getTruckDescriptionEn(truck),
      },
    },
  ];
}
