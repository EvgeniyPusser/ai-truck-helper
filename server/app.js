// import "dotenv/config";
// import express from "express";
// app.use(express.json());
// import cors from "cors";
// import morgan from "morgan";
// import helmet from "helmet";
// import path from "path";
// import { fileURLToPath } from "url";

// import chatRoutes from "./routes/chat.routes.js";
// import authRoutes from "./routes/auth.routes.js";
// import rolesRoutes from "./routes/roles.routes.js";
// import searchRoutes from "./routes/search.routes.js";
// import { notFound, errorHandler } from "./middleware/error.js";
// import { limits } from "./middleware/rateLimit.js";

// const app = express();

// // Разрешим фронт с Render и локалку
// const ALLOWED = [
//   "http://localhost:5173",
//   "https://ai-truck-helper-frontend.onrender.com",
//   "https://hollymove.com",
//   "https://www.hollymove.com",
// ];

// app.use(
//   cors({
//     origin: (origin, cb) => {
//       if (!origin || ALLOWED.includes(origin)) return cb(null, true);
//       return cb(new Error("Not allowed by CORS"));
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
// app.options("*", cors());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.get("/api/health", (_req, res) => {
//   res
//     .type("application/json")
//     .status(200)
//     .send({ ok: true, time: new Date().toISOString() });
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// import mapsRoutes from "./routes/maps.routes.js";
// app.use("/api/maps", mapsRoutes);

// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "http://localhost:3001",
//   "http://127.0.0.1:3001",
//   process.env.CLIENT_ORIGIN,
//   // Add Render domain pattern
//   /\.onrender\.com$/,
//   // Allow same origin requests for production
//   "self",
// ].filter(Boolean);

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
//         scriptSrc: ["'self'", "https://unpkg.com"],
//         imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"],
//         connectSrc: ["'self'", "https://nominatim.openstreetmap.org"],
//       },
//     },
//   })
// );
// app.use(
//   cors({
//     origin: allowedOrigins.length ? allowedOrigins : true,
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "1mb" }));
// app.use(morgan("tiny"));

// // Serve static files
// app.use(express.static(path.join(__dirname, "../public")));

// app.get("/health", (_req, res) => res.json({ ok: true }));

// // Serve frontend
// app.get("/", (_req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

// app.use("/api/auth", limits.auth, authRoutes);
// app.use("/api/chat", limits.chat, chatRoutes);
// app.use("/api/roles", rolesRoutes);
// app.use("/api", searchRoutes);

// app.use(notFound);
// app.use(errorHandler);

// export default app;

// server/app.js (or index.js)

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
import searchRoutes from "./routes/search.routes.js";
import mapsRoutes from "./routes/maps.routes.js";

import { notFound, errorHandler } from "./middleware/error.js";
import { limits } from "./middleware/rateLimit.js";

const app = express(); // ✅ create app BEFORE using it

import cors from "cors";
const ALLOWED = [
  "https://www.holymovela.com",
  "https://holymovela.com",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok =
        ALLOWED.includes(origin) ||
        /\.onrender\.com$/.test(new URL(origin).hostname);
      cb(null, ok);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// ---------- CORS (single, correct setup) ----------
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",

  // ✅ your production frontend(s)
  "https://www.holymovela.com",
  "https://holymovela.com",

  // (optional render static site if you have one)
  "https://ai-truck-helper-frontend.onrender.com",

  // env override if you set one (e.g., CLIENT_ORIGIN=https://staging.example.com)
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser/SSR/no-origin requests
      if (!origin) return cb(null, true);

      // Allow exact matches or *.onrender.com backends
      const allowed =
        ALLOWED_ORIGINS.includes(origin) ||
        /\.onrender\.com$/.test(new URL(origin).hostname);

      // IMPORTANT: don't throw — just deny (no headers). Browser will block it.
      return cb(null, allowed);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Make sure preflights succeed globally
app.options("*", cors());

// ---------- Security / parsers / logs ----------
app.use(
  helmet({
    // If you serve any HTML from THIS server that makes outbound requests,
    // widen connectSrc so the browser can reach APIs from that page.
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // default is 'self'
        connectSrc: [
          "'self'",
          "https://nominatim.openstreetmap.org",
          "https://*.tile.openstreetmap.org",
          "https://*.onrender.com", // ✅ allow Render API calls if serving a page here
          "https://api.openrouteservice.org", // if your server-side fetches are proxied to client
        ],
        imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"],
        scriptSrc: ["'self'", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      },
    },
  })
);

app.use(express.json({ limit: "1mb" })); // ✅ only once
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// ---------- Health checks ----------
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) =>
  res.status(200).json({ ok: true, time: new Date().toISOString() })
);

// ---------- Routes ----------
app.use("/api/maps", mapsRoutes);
app.use("/api/auth", limits.auth, authRoutes);
app.use("/api/chat", limits.chat, chatRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api", searchRoutes);

// ---------- Static (only if you actually serve a landing from here) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "../public/index.html"))
);

// ---------- Errors ----------
app.use(notFound);
app.use(errorHandler);

export default app;
