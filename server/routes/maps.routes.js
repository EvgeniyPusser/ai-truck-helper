import express from "express";
const router = express.Router();

/* -------------------- GEOCODERS -------------------- */
async function geocodeORS(query, key) {
  const base = "https://api.openrouteservice.org/geocode/search";
  const url = `${base}?api_key=${encodeURIComponent(
    key
  )}&text=${encodeURIComponent(query)}&size=1`;
  console.log(
    "[ORS geocode] GET",
    `${base}?api_key=***&text=${encodeURIComponent(query)}&size=1`
  );

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "User-Agent": "HollyMove/1.0",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ORS geocode ${res.status} ${text}`);
  }
  const data = await res.json();
  const feat = data?.features?.[0];
  if (!feat?.geometry?.coordinates) return null;
  const [lon, lat] = feat.geometry.coordinates;
  return { lat, lon, label: feat?.properties?.label || query };
}

async function geocodeNominatim(query) {
  const base = "https://nominatim.openstreetmap.org/search";
  const url = `${base}?format=json&q=${encodeURIComponent(query)}&limit=1`;
  console.log(
    "[Nominatim] GET",
    `${base}?format=json&q=${encodeURIComponent(query)}&limit=1`
  );

  const res = await fetch(url, {
    headers: {
      "User-Agent": "HollyMove/1.0",
      "Accept-Language": "en",
    },
  });
  if (!res.ok) return null;
  const arr = await res.json();
  const first = arr?.[0];
  if (!first) return null;
  return {
    lat: +first.lat,
    lon: +first.lon,
    label: first.display_name || query,
  };
}

/* -------------------- ROUTING -------------------- */
async function routeORS(a, b, key) {
  const base =
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
  const url = `${base}?api_key=${encodeURIComponent(key)}`;
  console.log("[ORS route] POST", `${base}?api_key=***`);

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
      "Accept-Language": "en",
      "User-Agent": "HollyMove/1.0",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ORS route ${res.status} ${text}`);
  }

  const json = await res.json();
  const feature = json?.features?.[0];
  const coords = feature?.geometry?.coordinates || [];
  const line = coords.map(([lon, lat]) => [lat, lon]); // для Leaflet
  const meters = feature?.properties?.summary?.distance ?? 0;
  const seconds = feature?.properties?.summary?.duration ?? 0;

  return {
    line,
    distance_km: +(meters / 1000).toFixed(1),
    duration_h: +(seconds / 3600).toFixed(1),
  };
}

async function routeOSRM(a, b) {
  // Публичный OSRM (без ключа), https чтобы не ловить смешанный контент
  const base = "https://router.project-osrm.org/route/v1/driving";
  const url = `${base}/${a.lon},${a.lat};${b.lon},${b.lat}?overview=full&geometries=geojson`;
  console.log("[OSRM route] GET", url);

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "HollyMove/1.0",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OSRM route ${res.status} ${text}`);
  }

  const json = await res.json();
  const route = json?.routes?.[0];
  const coords = route?.geometry?.coordinates || [];
  const line = coords.map(([lon, lat]) => [lat, lon]);
  const meters = route?.distance ?? 0;
  const seconds = route?.duration ?? 0;

  return {
    line,
    distance_km: +(meters / 1000).toFixed(1),
    duration_h: +(seconds / 3600).toFixed(1),
  };
}

/* -------------------- ENDPOINT -------------------- */
// POST /api/maps/route  { from:'Los Angeles, CA', to:'San Diego, CA' }
router.post("/route", async (req, res) => {
  try {
    const key = process.env.OPENROUTESERVICE_API_KEY;
    if (!key)
      return res.status(500).json({ error: "ORS key missing on server" });

    const { from, to } = req.body || {};
    if (!from || !to)
      return res.status(400).json({ error: "from and to are required" });

    console.log("[maps/route] from:", from, "| to:", to);

    // 1) Геокод: сначала ORS, при ошибке — Nominatim
    let A, B;
    try {
      [A, B] = await Promise.all([geocodeORS(from, key), geocodeORS(to, key)]);
    } catch (err) {
      console.warn(
        "[maps/route] ORS geocode failed → fallback Nominatim:",
        err.message
      );
      [A, B] = await Promise.all([
        geocodeNominatim(from),
        geocodeNominatim(to),
      ]);
    }
    if (!A || !B) return res.status(404).json({ error: "geocode_failed" });

    // 2) Маршрут: сначала ORS, при ошибке — OSRM
    let route;
    try {
      route = await routeORS(A, B, key);
    } catch (err) {
      console.warn(
        "[maps/route] ORS route failed → fallback OSRM:",
        err.message
      );
      route = await routeOSRM(A, B);
    }

    return res.json({ ok: true, from: A, to: B, route });
  } catch (e) {
    console.error("[/api/maps/route] error:", e.message);
    res.status(500).json({ error: "route_failed" });
  }
});

export default router;
