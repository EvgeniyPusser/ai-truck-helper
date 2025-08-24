import express from "express";
const router = express.Router();

// --- helpers ---
const US_BBOX = { minLat: 24, maxLat: 50, minLon: -125, maxLon: -66 };
const US_STATES = new Set([
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
]);

function isLikelyUS(q = "") {
  const s = q.trim();
  if (/\b\d{5}\b/.test(s)) return true; // ZIP 5 digits
  const m = s.match(/,\s*([A-Z]{2})(\b|,)/); // ", CA"
  if (m && US_STATES.has(m[1])) return true;
  if (/\b(USA|US|United States)\b/i.test(s)) return true;
  return false;
}
function inUSBbox({ lat, lon }) {
  return (
    lat >= US_BBOX.minLat &&
    lat <= US_BBOX.maxLat &&
    lon >= US_BBOX.minLon &&
    lon <= US_BBOX.maxLon
  );
}

async function geocodeORS(query, key, forceUS = false) {
  // Pelias supports boundary.country=USA + lang
  const url =
    `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(
      query
    )}&size=1` + (forceUS ? `&boundary.country=USA&lang=en` : `&lang=en`);
  const res = await fetch(url, {
    headers: { Accept: "application/json", Authorization: key },
  });
  if (!res.ok) throw new Error(`ORS_GEOCODE_${res.status}`);
  const data = await res.json();
  const feat = data?.features?.[0];
  if (!feat?.geometry?.coordinates) return null;
  const [lon, lat] = feat.geometry.coordinates;
  return { lat, lon };
}

async function geocodeNominatim(query, forceUS = false) {
  const isZip = /^\s*\d{5}\s*$/.test(query);
  const base = "https://nominatim.openstreetmap.org/search";
  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    "accept-language": "en",
  });
  if (forceUS) params.set("countrycodes", "us");
  if (isZip) params.set("postalcode", query.trim());
  else params.set("q", query);

  const url = `${base}?${params.toString()}`;
  const res = await fetch(url, { headers: { "User-Agent": "HollyMove/1.0" } });
  if (!res.ok) throw new Error(`NOM_GEOCODE_${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !data[0]) return null;
  return { lat: +data[0].lat, lon: +data[0].lon };
}

async function routeORS(a, b, key) {
  const url =
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
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
  if (!res.ok) throw new Error(`ORS_ROUTE_${res.status}`);
  const json = await res.json();
  const f = json?.features?.[0];
  const coords = f?.geometry?.coordinates || [];
  const latlng = coords.map(([lon, lat]) => [lat, lon]);
  const meters = f?.properties?.summary?.distance ?? 0;
  const seconds = f?.properties?.summary?.duration ?? 0;
  return {
    line: latlng,
    distance_km: +(meters / 1000).toFixed(1),
    duration_h: +(seconds / 3600).toFixed(1),
  };
}

async function routeOSRM(a, b) {
  const url = `https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM_${res.status}`);
  const data = await res.json();
  const r = data?.routes?.[0];
  const coords = r?.geometry?.coordinates || []; // [lon,lat]
  const latlng = coords.map(([lon, lat]) => [lat, lon]);
  return {
    line: latlng,
    distance_km: +(r.distance / 1000).toFixed(1),
    duration_h: +(r.duration / 3600).toFixed(1),
  };
}

// --- endpoint ---
router.post("/route", async (req, res) => {
  const key = process.env.OPENROUTESERVICE_API_KEY;
  const { from, to } = req.body || {};
  if (!from || !to)
    return res.status(400).json({ error: "from and to are required" });

  const forceUS_from = isLikelyUS(from);
  const forceUS_to = isLikelyUS(to);

  try {
    // 1) geocode with US bias
    let A, B;

    try {
      if (!key) throw new Error("NO_KEY");
      A = await geocodeORS(from, key, forceUS_from);
      B = await geocodeORS(to, key, forceUS_to);
      if (!A || !B) throw new Error("ORS_EMPTY");
      // sanity: если просили US, а точка вне США — перепробуем Nominatim c US
      if (forceUS_from && !inUSBbox(A)) A = null;
      if (forceUS_to && !inUSBbox(B)) B = null;
    } catch (_) {
      /* fallthrough */
    }

    if (!A) A = await geocodeNominatim(from, forceUS_from);
    if (!B) B = await geocodeNominatim(to, forceUS_to);
    if (!A || !B) throw new Error("GEOCODE_FAILED");

    // 2) route ORS → OSRM fallback
    let route;
    try {
      if (!key) throw new Error("NO_KEY");
      route = await routeORS(A, B, key);
    } catch (_) {
      route = await routeOSRM(A, B);
    }

    return res.json({
      ok: true,
      from: { ...A, label: from },
      to: { ...B, label: to },
      route,
    });
  } catch (e) {
    console.error("[/api/maps/route] error:", e?.message || e);
    return res.status(500).json({ error: "route_failed" });
  }
});

export default router;
