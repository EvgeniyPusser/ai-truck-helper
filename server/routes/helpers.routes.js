import { Router } from "express";
import { getHelpers } from "../controllers/helpers.controller.js";

const r = Router();

r.post("/", getHelpers);

export default r;
