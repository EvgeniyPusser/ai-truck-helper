// server/routes/roles.routes.js
import express from "express";
import { requireAuth } from "../middleware/auth.js"; // <-- named export
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

// Только админ видит список ролей
router.get("/", requireAuth, requireRole("admin"), (_req, res) => {
  res.json({
    roles: ["client", "helper", "truck_owner", "moving_company", "agent"],
  });
});

// Добавление роли (пока заглушка)
router.post("/", requireAuth, requireRole("admin"), (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: "Role is required" });
  res.json({ message: `Role "${role}" added successfully` });
});

export default router;
