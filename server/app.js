import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import helpersRoutes from "./routes/helpers.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { limits } from "./middleware/rateLimit.js";

const app = express();

// ✅ CORS
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// middleware
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("tiny"));

// health-check
app.get("/health", (_req, res) => res.json({ ok: true }));
app.post("/api/route", (req, res) => {
  res.json({ alive: true, got: req.body });
});

// ✅ API роуты (только один блок!)
app.use("/api/auth", limits.auth, authRoutes);
app.use("/api/chat", limits.chat, chatRoutes);
app.use("/api/helpers", helpersRoutes);
app.use("/api/route", orsRoutes); // теперь точно работает
app.use("/api/plan", planRoutes);

// ошибки
app.use(notFound);
app.use(errorHandler);

export default app;
