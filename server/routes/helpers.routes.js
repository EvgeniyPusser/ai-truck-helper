import { Router } from "express";
const r = Router();

import { getHelpers } from "../controllers/helpers.controller.js";

r.post("/", getHelpers);

// мини-валидация без бизнес-формул
function isZip(v) {
  return typeof v === "string" && /^\d{5}$/.test(v);
}

r.post("/", (req, res) => {
  const { pickupZip, dropoffZip, rooms, volume, date } = req.body || {};
  const errors = [];

  if (!isZip(pickupZip)) errors.push("pickupZip must be 5 digits (US ZIP).");
  if (!isZip(dropoffZip)) errors.push("dropoffZip must be 5 digits (US ZIP).");

  if (rooms != null && (!Number.isInteger(rooms) || rooms < 1 || rooms > 10)) {
    errors.push("rooms must be an integer from 1 to 10.");
  }
  if (volume != null && (isNaN(volume) || volume < 1 || volume > 1000)) {
    errors.push("volume must be a number from 1 to 1000.");
  }
  if (!date) errors.push("date is required (YYYY-MM-DD).");

  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }

  // без «коэффициентов»: просто возвращаем валидные данные
  return res.json({
    ok: true,
    received: { pickupZip, dropoffZip, rooms, volume, date },
  });
});

export default r;
