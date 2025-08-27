import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { limits } from "../middleware/rateLimit.js";
const r = Router();
r.post("/login", limits.auth, login);
export default r;
