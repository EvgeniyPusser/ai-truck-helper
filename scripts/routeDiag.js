import fetch from "node-fetch";

// 1) Nominatim: геокодинг (без ключа)
async function geocode(q) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    q
  )}`;
  const r = await fetch(url, {
    headers: {
      "User-Agent": "HolyMove/1.0 (diag)",
      Accept: "application/json",
    },
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`Nominatim ${r.status}: ${t}`);
  const data = JSON.parse(t);
  if (!Array.isArray(data) || !data[0]?.lon || !data[0]?.lat) {
    throw new Error("Nominatim: no results");
  }
  return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
}

// 2) OSRM: маршрут (без ключа)
async function route(origin, dest) {
  const [olng, olat] = origin;
  const [dlng, dlat] = dest;
  const url = `https://router.project-osrm.org/route/v1/driving/${olng},${olat};${dlng},${dlat}?overview=false&geometries=geojson`;
  const r = await fetch(url, {
    headers: {
      "User-Agent": "HolyMove/1.0 (diag)",
      Accept: "application/json",
    },
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`OSRM ${r.status}: ${t}`);
  const data = JSON.parse(t);
  const rr = data?.routes?.[0];
  if (!rr) throw new Error("OSRM: no route");
  return { distance: rr.distance, duration: rr.duration };
}

(async () => {
  try {
    const FROM = process.argv[2] || "Los Angeles, CA";
    const TO = process.argv[3] || "San Diego, CA";
    console.log("FROM:", FROM);
    console.log("TO  :", TO);

    const a = await geocode(FROM);
    const b = await geocode(TO);
    console.log("A coords:", a);
    console.log("B coords:", b);

    const r = await route(a, b);
    console.log("Route OK:", r); // meters & seconds
    process.exit(0);
  } catch (e) {
    console.error("DIAG ERROR:", e.message);
    process.exit(1);
  }
})();
