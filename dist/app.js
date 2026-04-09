import express from "express";
import cors from "cors";
import helpersRoutes from "./routes/helpers.routes.js";
import mapsRoutes from "./routes/maps.routes.js";
import aiRoutes from "./routes/ai.routes.js";
const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://holymovela.com",
    "https://www.holymovela.com",
    // Add any other domains (ngrok, staging, etc.) as needed
    ...(process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
        : []),
];
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (curl, Postman, server-to-server)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json({ limit: "2mb" }));
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "core" });
});
app.use("/api/helpers", helpersRoutes);
app.use("/api/maps", mapsRoutes);
app.use("/api/ai-local", aiRoutes);
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});
export default app;
