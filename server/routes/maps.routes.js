import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const ORS_API_KEY = process.env.ORS_API_KEY;

// POST /api/maps/route
router.post("/route", async (req, res) => {
  try {
    const { coordinates } = req.body;
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res
        .status(400)
        .json({ error: "Coordinates required: [from, to]" });
    }
    const orsUrl =
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
    const orsRes = await fetch(orsUrl, {
      method: "POST",
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coordinates }),
    });
    if (!orsRes.ok) {
      const text = await orsRes.text();
      return res.status(orsRes.status).json({ error: text });
    }
    const orsData = await orsRes.json();
    res.json(orsData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DEMO: простая страница с картой и маршрутом (без фронта)
router.get("/map-demo", async (req, res) => {
  const coordinates = [
    [-74.006, 40.7128], // Нью-Йорк (lng, lat)
    [-118.2437, 34.0522], // Лос-Анджелес (lng, lat)
  ];
  try {
    const orsUrl =
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson";
    const orsRes = await fetch(orsUrl, {
      method: "POST",
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coordinates }),
    });
    if (!orsRes.ok) {
      const text = await orsRes.text();
      return res.status(orsRes.status).send(`<pre>${text}</pre>`);
    }
    const orsData = await orsRes.json();
    const routeCoords = orsData.features[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Маршрут ORS Demo</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style> #map { width: 100vw; height: 90vh; } </style>
      </head>
      <body>
        <h2>Маршрут: Нью-Йорк → Лос-Анджелес</h2>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([37.8, -96], 4);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          const route = ${JSON.stringify(routeCoords)};
          L.polyline(route, { color: 'red', weight: 5 }).addTo(map);
          L.marker(route[0]).addTo(map).bindPopup('Start').openPopup();
          L.marker(route[route.length-1]).addTo(map).bindPopup('End');
          map.fitBounds(L.polyline(route).getBounds(), { padding: [20, 20] });
        </script>
      </body>
      </html>
    `);
  } catch (e) {
    res.status(500).send(`<pre>${e.message}</pre>`);
  }
});

export default router;
