import express from "express";
import cors from "cors";
import { askAI } from "./api/chat.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const trucks = JSON.parse(
  fs.readFileSync(path.resolve("./src/data/trucks.json"), "utf-8")
);

const plannerConfig = JSON.parse(
  fs.readFileSync(path.resolve("./src/logic/planner.json"), "utf-8")
);

// ... остальной код без изменений


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function calculateHelpers(volume) {
  const { helpersPerVolume, minHelpers, maxHelpers } = plannerConfig;
  let helpers = Math.ceil(volume * helpersPerVolume);
  if (helpers < minHelpers) helpers = minHelpers;
  if (helpers > maxHelpers) helpers = maxHelpers;
  return helpers;
}

function calculatePrice(distanceKm, volume) {
  const { basePricePerKm, pricePerM3 } = plannerConfig;
  return basePricePerKm * distanceKm + pricePerM3 * volume;
}

function selectTruck(volume) {
  // Сортируем грузовики по объёму по возрастанию
  const sortedTrucks = trucks.slice().sort((a, b) => a.volume_m3 - b.volume_m3);

  // Ищем первый грузовик, который подходит по объёму
  for (const truck of sortedTrucks) {
    if (truck.volume_m3 >= volume) {
      return truck;
    }
  }

  // Если не нашли подходящий — возвращаем самый большой
  return sortedTrucks[sortedTrucks.length - 1];
}

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const aiResponse = await askAI(message);

    const {
      estimated_volume_m3,
      estimated_distance_km,
      from,
      to,
      date,
      comments,
    } = aiResponse;

    // Выбираем грузовик из trucks.json по объёму
    const truck = selectTruck(estimated_volume_m3);

    const helpers_needed = calculateHelpers(estimated_volume_m3);
    const estimated_price_usd = calculatePrice(estimated_distance_km, estimated_volume_m3);

    const reply = {
      from,
      to,
      date,
      truck_size: truck.id,       // Используем id из trucks.json
      truck_name: truck.name,     // Добавляем имя для удобства
      estimated_volume_m3,
      estimated_distance_km,
      helpers_needed,
      estimated_price_usd,
      comments,
      pricing_formula: plannerConfig.notes,
    };

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "AI request failed or calculation error" });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚚 AI Truck Helper running at http://localhost:${PORT}`);
});

