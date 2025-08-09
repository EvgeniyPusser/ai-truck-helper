// src/services/route.js
import fetch from "node-fetch";

export async function getRoute(origin, dest) {
  const [olng, olat] = origin;
  const [dlng, dlat] = dest;
  const url = `https://router.project-osrm.org/route/v1/driving/${olng},${olat};${dlng},${dlat}?overview=full&geometries=geojson`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "HolyMove/1.0 (support@holymove.example)",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OSRM ${res.status}: ${txt || res.statusText}`);
  }

  const data = await res.json();
  const r = data?.routes?.[0];
  if (!r) throw new Error("OSRM: no route found");

  return {
    distance: r.distance, // meters
    duration: r.duration, // seconds
    geometry: r.geometry, // GeoJSON LineString
    source: "OSRM",
  };
}
