import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { limits } from "./middleware/rateLimit.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  process.env.CLIENT_ORIGIN,
  // Add Render domain pattern
  /\.onrender\.com$/,
  // Allow same origin requests for production
  "self"
].filter(Boolean);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        scriptSrc: ["'self'", "https://unpkg.com"],
        imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"],
        connectSrc: ["'self'", "https://nominatim.openstreetmap.org"],
      },
    },
  })
);
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Serve frontend
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/api/auth", limits.auth, authRoutes);
app.use("/api/chat", limits.chat, chatRoutes);
app.use("/api/roles", rolesRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
