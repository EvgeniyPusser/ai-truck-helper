import express from "express";
import cors from "cors";
import helpersRoutes from "./routes/helpers.routes.js";
import mapsRoutes from "./routes/maps.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import providersRoutes from "./routes/providers.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { getMongoHealth } from "./db/mongo.js";
import { isPrismaConfigured, prisma } from "./db/prisma.js";
import { apiRequestLogger } from "./services/apiRequestLogs.js";
const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "https://holymovela.com",
    "https://www.holymovela.com",
    "https://ai-truck-helper-frontend.onrender.com",
    // Add any other domains (ngrok, staging, etc.) as needed
    ...(process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
        : []),
];
function isLocalDevOrigin(origin) {
    return /^http:\/\/(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3}):(517[3-9]|417[3-9])$/.test(origin);
}
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (curl, Postman, server-to-server)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.use(apiRequestLogger);
app.get("/api/health", async (_req, res) => {
    const mongo = await getMongoHealth();
    const supabase = {
        configured: isPrismaConfigured(),
        connected: false,
    };
    if (prisma) {
        try {
            await prisma.$queryRaw `SELECT 1`;
            supabase.connected = true;
        }
        catch (error) {
            supabase.error = String(error?.message || error);
        }
    }
    res.json({ status: "ok", service: "core", mongo, supabase });
});
app.use("/api/helpers", helpersRoutes);
app.use("/api/maps", mapsRoutes);
app.use("/api/ai-local", aiRoutes);
app.use("/api/providers", providersRoutes);
app.use("/api/admin", adminRoutes);
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});
export default app;
