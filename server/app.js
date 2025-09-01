import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import helpersRoutes from "./routes/helpers.routes.js";
import orsRoutes from "./routes/ors.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { limits } from "./middleware/rateLimit.js";

const app = express();

// ✅ список разрешённых источников
const allowedOrigins = [
  "http://localhost:5173",
  "https://holymovela.com",
  "https://www.holymovela.com",
];

// ✅ CORS настройки
const corsOptions = {
  origin: true,
  credentials: true,
};

// ✅ сначала CORS (и preflight)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// потом остальное
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("tiny"));

// health-чек
app.get("/health", (_req, res) => res.json({ ok: true }));

// API роуты
app.use("/api/auth", limits.auth, authRoutes);
app.use("/api/chat", limits.chat, chatRoutes);
app.use("/api/helpers", helpersRoutes);
app.use("/api/route", orsRoutes);

// ошибки
app.use(notFound);
app.use(errorHandler);

export default app;



