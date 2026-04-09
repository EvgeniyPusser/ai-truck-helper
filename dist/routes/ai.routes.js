import { Router } from "express";
const router = Router();
const AI_LOCAL_URL = process.env.AI_LOCAL_URL || "http://localhost:1234/v1/chat/completions";
const AI_LOCAL_MODEL = process.env.AI_LOCAL_MODEL || "google/gemma-3-4b";
const AI_LOCAL_TIMEOUT_MS = Number(process.env.AI_LOCAL_TIMEOUT_MS || 90000);
router.post("/", async (req, res) => {
    const message = req.body?.message;
    if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            error: "message is required",
        });
    }
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), AI_LOCAL_TIMEOUT_MS);
        try {
            const response = await fetch(AI_LOCAL_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                body: JSON.stringify({
                    model: AI_LOCAL_MODEL,
                    messages: [{ role: "user", content: message }],
                }),
            });
            const text = await response.text();
            const data = text ? JSON.parse(text) : null;
            if (!response.ok) {
                return res.status(response.status).json({
                    error: "AI upstream error",
                    details: data,
                });
            }
            return res.json(data);
        }
        finally {
            clearTimeout(timeout);
        }
    }
    catch (err) {
        if (err?.name === "AbortError") {
            return res.status(504).json({
                error: "AI timeout",
                details: `No response within ${AI_LOCAL_TIMEOUT_MS} ms`,
            });
        }
        return res.status(500).json({
            error: "AI error",
            details: String(err?.message || err),
        });
    }
});
export default router;
