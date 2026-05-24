import { Router } from "express";
import {
  getPersistenceState,
  setSaveHelperRequests,
} from "../services/persistenceState.js";

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

export default router;
