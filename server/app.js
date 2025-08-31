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

const allowedOrigins = [
  "http://localhost:5173",
  "https://holymovela.com",
  "https://www.holymovela.com",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));




app.use(helmet());

app.use(express.json({ limit: "5mb" }));
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", limits.auth, authRoutes);
app.use("/api/chat", limits.chat, chatRoutes);

app.use("/api/helpers", helpersRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
