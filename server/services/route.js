// server/services/route.js
import fetch from "node-fetch";

/** Запрашивает маршрут в OSRM и возвращает distance (м), duration (с), geometry (LineString) */
export async function getRoute(origin, dest) {
  const [olng, olat] = origin;
  const [dlng, dlat] = dest;
  
  // List of OSRM servers to try
  const osrmServers = [
    "https://routing.openstreetmap.de/routed-car/route/v1/driving",
    "https://osrm.org/route/v1/driving",
    // Fallback: create a simple straight-line route if all servers fail
  ];

  for (const baseUrl of osrmServers) {
    try {
      const url = `${baseUrl}/${olng},${olat};${dlng},${dlat}?overview=full&geometries=geojson`;
      console.log(`Trying OSRM server: ${baseUrl}`);
      
      const res = await fetch(url, {
        headers: {
          "User-Agent": "HolyMove/1.0",
          "Accept": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      if (!res.ok) {
        console.log(`Server ${baseUrl} returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      const r = data?.routes?.[0];
      if (!r) {
        console.log(`Server ${baseUrl} returned no routes`);
        continue;
      }

      console.log(`Successfully got route from ${baseUrl}`);
      return {
        distance: r.distance, // meters
        duration: r.duration, // seconds
        geometry: r.geometry, // GeoJSON LineString
        source: "OSRM",
      };
      
    } catch (error) {
      console.log(`Error with server ${baseUrl}:`, error.message);
      continue;
    }
  }
  
  // If all OSRM servers fail, create a fallback straight-line route
  console.log("All OSRM servers failed, creating fallback route");
  return createFallbackRoute(origin, dest);
}

function createFallbackRoute(origin, dest) {
  const [olng, olat] = origin;
  const [dlng, dlat] = dest;
  
  // Calculate straight-line distance using Haversine formula
  const R = 6371000; // Earth's radius in meters
  const φ1 = olat * Math.PI / 180;
  const φ2 = dlat * Math.PI / 180;
  const Δφ = (dlat - olat) * Math.PI / 180;
  const Δλ = (dlng - olng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // in meters

  // Estimate duration (assume average speed of 60 mph = 26.8 m/s)
  const duration = distance / 26.8; // in seconds

  // Create simple 2-point geometry (straight line)
  const geometry = {
    type: "LineString",
    coordinates: [
      [olng, olat],
      [dlng, dlat]
    ]
  };

  return {
    distance: distance,
    duration: duration,
    geometry: geometry,
    source: "Fallback",
  };
}
