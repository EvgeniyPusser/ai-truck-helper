import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { limits } from "./middleware/rateLimit.js";



const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.VITE_API_URL,
  `https://${process.env.NGROK_DOMAIN}`,
].filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o)))
        return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.json({ ok: true }));
// app.use("/py", pyRoutes);

app.use("/api/auth", limits.auth, authRoutes);
app.use("/api/chat", limits.chat, chatRoutes);

// app.use("/api/py", limits.chat, pyRoutes); 

app.use(notFound);
app.use(errorHandler);

export default app;
