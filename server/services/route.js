import fetch from "node-fetch";
import { config } from "../config.js"; // config.orsApiKey

export async function getRoute(origin, dest) {
  const url = "https://api.openrouteservice.org/v2/directions/driving-car";
  const body = {
    coordinates: [origin, dest],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: config.orsApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`ORS ${res.status}: ${txt || res.statusText}`);
  }

  const data = await res.json();
  const r = data?.routes?.[0];
  if (!r) throw new Error("ORS: no route found");

  return {
    distance: r.summary.distance, // meters
    duration: r.summary.duration, // seconds
    geometry: r.geometry, // GeoJSON LineString
    source: "ORS",
  };
}
