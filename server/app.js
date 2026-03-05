import express from "express";
import cors from "cors";
import helpersRoutes from "./routes/helpers.routes.js";
import mapsRoutes from "./routes/maps.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "core" });
});

app.use("/api/helpers", helpersRoutes);
app.use("/api/maps", mapsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
