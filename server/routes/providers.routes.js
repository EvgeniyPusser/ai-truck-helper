import { Router } from "express";
import { listProviders, seedProviders } from "../services/providersDb.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const providers = await listProviders({
      serviceType: req.query.serviceType,
    });

    res.json({ providers });
  } catch (error) {
    res.status(500).json({
      error: "Failed to load providers",
      details: String(error?.message || error),
    });
  }
});

router.post("/seed", async (_req, res) => {
  try {
    const result = await seedProviders();
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({
      error: "Failed to seed providers",
      details: String(error?.message || error),
    });
  }
});

export default router;
