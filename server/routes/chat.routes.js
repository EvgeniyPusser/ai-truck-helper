import { Router } from "express";
import { chatHandler } from "../controllers/chat.controller.js";
import { requireAuth } from "../middleware/auth.js"; // ← add this

const r = Router();

r.get("/ping", (req, res) => res.json({ alive: true }));

// Require JWT now:
r.post("/", requireAuth, chatHandler); // ← change this line

export default r;
