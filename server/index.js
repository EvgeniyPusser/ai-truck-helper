// import http from "http";
// import app from "./app.js";
// // server/app.js или server/index.js
// import helpersRoutes from "./routes/helpers.routes.js";

// app.use("/api/helpers", helpersRoutes); // теперь POST /api/helpers существует

// const PORT = process.env.PORT || 3001;
// const server = http.createServer(app);

// server.listen(PORT, () => {
//   console.log(`[HolyMove] API listening on :${PORT}`);
// });

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import mapsRouter from "./routes/maps.routes";

// Загружаем .env именно из КОРНЯ репозитория
const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "..", ".env"),
  path.resolve(__dirname, "../..", ".env"),
];
for (const p of envCandidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true, // при необходимости укажи конкретный домен
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/maps", mapsRouter);

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
