import { Router } from "express";
import { askLocalAi } from "../services/localAi.js";

const router = Router();

const AI_LOCAL_TIMEOUT_MS = Number(process.env.AI_LOCAL_TIMEOUT_MS || 90000);

router.post("/", async (req, res) => {
  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "message is required",
    });
  }

  try {
    const data = await askLocalAi(message);
    return res.json(data);
  } catch (err) {
    if (err?.name === "AbortError") {
      return res.status(504).json({
        error: "AI timeout",
        details: `No response within ${AI_LOCAL_TIMEOUT_MS} ms`,
      });
    }

    if (err?.status) {
      return res.status(err.status).json({
        error: "AI upstream error",
        details: err.details,
      });
    }

    return res.status(500).json({
      error: "AI error",
      details: String(err?.message || err),
    });
  }
});

export default router;
