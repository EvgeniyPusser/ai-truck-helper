import express from "express";
import cors from "cors";
import helpersRoutes from "./routes/helpers.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "core" });
});

// Minimal chat stub — временно, чтобы фронт мог работать
app.post("/api/chat", (req, res) => {
  const message = req.body?.message || "no message";
  console.log("Chat message received:", message);
  res.json({
    reply: `Server received: ${message}`,
  });
});

// Подключаем правильный роут для helpers
app.use("/api/helpers", helpersRoutes);

// 404 at the end
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
