import { buildPlan } from "../services/chat.service.js";

export async function chatHandler(req, res, next) {
  try {
    const plan = await buildPlan(req.body || {});
    res.json(plan);
  } catch (e) {
    next(e);
  }
}
