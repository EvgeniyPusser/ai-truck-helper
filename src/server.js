import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { askAI } from "./api/chat.js";

dotenv.config();

// Load trucks data JSON
const trucks = JSON.parse(
  fs.readFileSync(path.resolve("./src/data/trucks.json"), "utf-8")
);

// Pricing parameters
const helpersPerVolume = 0.5;
const minHelpers = 1;
const maxHelpers = 5;
const basePricePerKm = 2.5;
const pricePerM3 = 30;
const notes = "Default pricing without planner.json";

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Helper functions
function calculateHelpers(volume) {
  let helpers = Math.ceil(volume * helpersPerVolume);
  if (helpers < minHelpers) helpers = minHelpers;
  if (helpers > maxHelpers) helpers = maxHelpers;
  return helpers;
}

function calculatePrice(distanceKm, volume) {
  return basePricePerKm * distanceKm + pricePerM3 * volume;
}

function selectTruck(volume) {
  const sortedTrucks = trucks.slice().sort((a, b) => a.volume_m3 - b.volume_m3);
  for (const truck of sortedTrucks) {
    if (truck.volume_m3 >= volume) {
      return truck;
    }
  }
  return sortedTrucks[sortedTrucks.length - 1];
}

// API route: /api/chat (existing AI + calculation)
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

    const truck = selectTruck(estimated_volume_m3);
    const helpers_needed = calculateHelpers(estimated_volume_m3);
    const estimated_price_usd = calculatePrice(
      estimated_distance_km,
      estimated_volume_m3
    );

    const reply = {
      from,
      to,
      date,
      truck_size: truck.id,
      truck_name: truck.name,
      estimated_volume_m3,
      estimated_distance_km,
      helpers_needed,
      estimated_price_usd,
      comments,
      pricing_formula: notes,
    };

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "AI request failed or calculation error" });
  }
});

// Hardcoded users for authentication
const users = [
  { id: "1", email: "client@example.com", password: "1234", role: "client" },
  { id: "2", email: "owner@example.com", password: "1234", role: "truckOwner" },
  { id: "3", email: "helper@example.com", password: "1234", role: "helper" },
  { id: "4", email: "agent@example.com", password: "1234", role: "agent" },
  { id: "5", email: "mover@example.com", password: "1234", role: "mover" },
];

// Secret for JWT signing (put real secret in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// API route: /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚚 AI Truck Helper backend running at http://localhost:${PORT}`);
});
