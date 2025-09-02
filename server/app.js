// server/app.js  — версия "maps-only"
import "dotenv/config";
import express from "express";
import mapsRoutes from "./routes/maps.routes.js";

const app = express();

// парсер тела — ДО роутов
app.use(express.json({ limit: "5mb" }));

// health
app.get("/health", (_req, res) => res.json({ ok: true, ctx: "maps-only" }));

// ТОЛЬКО карты
app.use("/api/maps", mapsRoutes);

// 404 (в самом конце)
app.use((req, res) => {
  res.status(404).json({ error: "Not found (maps-only)" });
});

// обработчик ошибок (минимальный)
app.use((err, _req, res, _next) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: err?.message || "Server error" });
});

export default app;
