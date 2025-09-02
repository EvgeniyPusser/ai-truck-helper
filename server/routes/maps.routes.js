import { Router } from "express";

const router = Router();

// Общая функция запроса к ORS и конвертации геометрии в [lat,lng]
async function orsRoute(coordinates, profile = "driving-car", simplify = true) {
  const url = `https://api.openrouteservice.org/v2/directions/${encodeURIComponent(
    profile
  )}/geojson`;
  const body = { coordinates, geometry_simplify: !!simplify }; // ORS ждёт [lng,lat]

  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: process.env.ORS_API_KEY || "",
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/geo+json, application/json",
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`ORS HTTP ${r.status}: ${txt}`);
  }

  const geo = await r.json();
  const line = geo?.features?.[0]?.geometry?.coordinates; // [[lng,lat],...]
  if (!Array.isArray(line) || line.length < 2) {
    throw new Error("No route geometry");
  }
  return line.map(([lng, lat]) => [lat, lng]); // → Leaflet порядок
}

// POST /api/maps/route — API для фронта (если понадобится)
router.post("/route", async (req, res) => {
  try {
    const {
      coordinates,
      profile = "driving-car",
      simplify = true,
    } = req.body || {};
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({
        error:
          "coordinates must be an array of [lng,lat] with at least two points",
      });
    }
    const latlng = await orsRoute(coordinates, profile, simplify);
    res.json({ route: { profile, coordinates: latlng } });
  } catch (e) {
    res.status(500).json({
      error: "Route calculation failed",
      details: String(e?.message || e),
    });
  }
});

// GET /api/maps/demo — HTML-страница с картой и демо-маршрутом (без фронта)
router.get("/demo", async (_req, res) => {
  try {
    // LA -> Phoenix (в ORS формате [lng,lat])
    const coordsORS = [
      [-118.243683, 34.052235],
      [-112.074036, 33.448376],
    ];
    const latlng = await orsRoute(coordsORS);

    const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Demo Route (LA → Phoenix)</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
<style>
  html,body,#map{height:100%;margin:0}
  #map{border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
</style>
</head><body>
<div id="map"></div>
<script>window.__ROUTE__=${JSON.stringify(latlng)};</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
  const route = window.__ROUTE__;
  const map = L.map('map', { scrollWheelZoom: true }).setView([37.8,-96], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const line = L.polyline(route, { weight: 5, lineJoin: 'round' }).addTo(map);
  const start = route[0], end = route[route.length-1];
  L.marker(start).bindPopup('Start: Los Angeles').addTo(map);
  L.marker(end).bindPopup('End: Phoenix').addTo(map);
  map.fitBounds(line.getBounds(), { padding: [20,20] });
</script>
</body></html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});

export default router;
