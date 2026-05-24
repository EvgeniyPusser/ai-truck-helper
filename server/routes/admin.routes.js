import { Router } from "express";
import {
  getPersistenceState,
  setSaveHelperRequests,
} from "../services/persistenceState.js";
import {
  createPriceSample,
  getPriceSampleStats,
  listPriceSamples,
} from "../services/priceSamples.js";

const router = Router();

function isAuthorized(req) {
  const password = process.env.ADMIN_PASSWORD || process.env.ADMIN_TOKEN || "";
  if (!password) return false;

  return (
    req.get("x-admin-token") === password ||
    req.body?.password === password
  );
}

router.get("/persistence", (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.json(getPersistenceState());
});

router.post("/persistence", (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (typeof req.body?.saveHelperRequests !== "boolean") {
    return res.status(400).json({
      error: "saveHelperRequests boolean is required",
    });
  }

  return res.json(setSaveHelperRequests(req.body.saveHelperRequests));
});

router.get("/price-samples", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const samples = await listPriceSamples(req.query);
    const stats = await getPriceSampleStats();
    return res.json({ samples, stats });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to load price samples",
      details: String(error?.message || error),
    });
  }
});

router.post("/price-samples", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sample = await createPriceSample(req.body);
    return res.status(201).json({ sample });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Failed to save price sample",
      errors: error.errors,
      details: String(error?.message || error),
    });
  }
});

export default router;
