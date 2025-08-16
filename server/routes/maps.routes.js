import express from "express";
const router = express.Router();

// парсим JSON прямо тут (чтобы тело было в req.body)
router.use(express.json());

// --- ORS helpers ---
// --- ORS helpers (с логом) ---
async function geocodeORS(query, key) {
  const url = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(query)}&size=1`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: key,
      "User-Agent": "HollyMove/1.0",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "<no body>");
    console.error("[ORS geocode] status:", res.status, "body:", body);
    throw new Error(`ORS geocode ${res.status}`);
  }

  const data = await res.json();
  const feat = data?.features?.[0];
  if (!feat?.geometry?.coordinates) return null;
  const [lon, lat] = feat.geometry.coordinates;
  return { lat, lon };
}

async function routeORS(a, b, key) {
  const url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
  const body = {
    coordinates: [
      [a.lon, a.lat],
      [b.lon, b.lat],
    ],
    instructions: false,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json, application/geo+json",
      "Content-Type": "application/json",
      Authorization: key,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    console.error("[ORS route] status:", res.status, "body:", text);
    throw new Error(`ORS route ${res.status}`);
  }

  const json = await res.json();
  const feature = json?.features?.[0];
  const coords = feature?.geometry?.coordinates || [];
  const latlng = coords.map(([lon, lat]) => [lat, lon]);
  const meters = feature?.properties?.summary?.distance ?? 0;
  const seconds = feature?.properties?.summary?.duration ?? 0;
  return {
    line: latlng,
    distance_km: +(meters / 1000).toFixed(1),
    duration_h: +(seconds / 3600).toFixed(1),
  };
}


// POST /api/maps/route  { from:'...', to:'...' }
router.post("/route", async (req, res) => {
  try {
    const key = process.env.OPENROUTESERVICE_API_KEY;
    if (!key) return res.status(500).json({ error: "ORS key missing on server" });

    const { from, to } = req.body || {};
    if (!from || !to) return res.status(400).json({ error: "from and to are required" });

    console.log("[maps/route] from:", from, "| to:", to, "| keyLen:", (key || "").length);

    const [A, B] = await Promise.all([geocodeORS(from, key), geocodeORS(to, key)]);
    if (!A || !B) return res.status(404).json({ error: "geocode_failed" });

    const route = await routeORS(A, B, key);
    res.json({ ok: true, from: { ...A, label: from }, to: { ...B, label: to }, route });
  } catch (e) {
    console.error("ORS route error:", e);
    res.status(500).json({ error: "route_failed" });
  }
});

export default router;
