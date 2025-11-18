import { Router } from "express";
const r = Router();


import { getHelpers } from "../controllers/helpers.controller.js";

// мини-валидация как middleware
function isZip(v) {
  return typeof v === "string" && /^\d{5}$/.test(v);
}

function validateHelperRequest(req, res, next) {
  const { pickupZip, dropoffZip, rooms, helpers, volume, date } =
    req.body || {};
  const errors = [];

  // Добавляем логирование для отладки
  console.log("Validation input:", {
    pickupZip,
    dropoffZip,
    rooms,
    helpers,
    volume,
    date,
  });

  if (!isZip(pickupZip)) errors.push("pickupZip must be 5 digits (US ZIP).");
  if (!isZip(dropoffZip)) errors.push("dropoffZip must be 5 digits (US ZIP).");

  if (rooms != null && (!Number.isInteger(rooms) || rooms < 1 || rooms > 10)) {
    errors.push("rooms must be an integer from 1 to 10.");
  }
  if (
    helpers != null &&
    (!Number.isInteger(helpers) || helpers < 1 || helpers > 10)
  ) {
    errors.push("helpers must be an integer from 1 to 10.");
  }
  if (volume != null && (isNaN(volume) || volume < 1 || volume > 1000)) {
    errors.push("volume must be a number from 1 to 1000.");
  }
  if (!date) errors.push("date is required (YYYY-MM-DD).");

  if (errors.length) {
    console.log("Validation errors:", errors);
    return res.status(400).json({ ok: false, errors });
  }

  console.log("Validation passed");
  next();
}

r.post("/", validateHelperRequest, getHelpers);

export default r;
