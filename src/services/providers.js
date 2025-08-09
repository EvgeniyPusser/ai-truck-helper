// src/services/providers.js
import fetch from "node-fetch";
import { config } from "../config.js"; // config.DOLLY_API_KEY и т.д.

export async function findHelpers(lat, lng, date) {
  const res = await fetch(
    `https://api.dolly.com/v1/requests?lat=${lat}&lng=${lng}&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey /* или DOLLY_API_KEY */}`,
      },
    }
  );
  if (!res.ok) throw new Error(`findHelpers error: ${res.status}`);
  const data = await res.json();
  // Предположим, data.helpers — массив
  return data.helpers.map((h) => ({
    id: h.id,
    name: h.name,
    rate: h.rate,
    source: "Dolly",
  }));
}
