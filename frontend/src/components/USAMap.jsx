
// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// /** @typedef {[number, number]} LatLng */

// const USA_BOUNDS = [
//   [24.396308, -125.0],
//   [49.384358, -66.93457],
// ];

// /**
//  * @param {{ coords: LatLng[] }} props
//  */
// function FitToRoute({ coords }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!coords || coords.length < 2) return;
//     map.fitBounds(coords, { padding: [20, 20] });
//   }, [coords, map]);
//   return null;
// }

// export default function USAMap() {
//   /** @type {[LatLng[] | null, Function]} */
//   const [route, setRoute] = useState(null);

//   useEffect(() => {
//     // Пример: LA -> Phoenix (координаты строго [lng, lat] для запроса)
//     /** @type {Array<[number, number]>} */
//     const coordsORS = [
//       [-118.243683, 34.052235], // Los Angeles [lng, lat]
//       [-112.074036, 33.448376], // Phoenix [lng, lat]
//     ];

//     fetch(`/api/maps/route`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         coordinates: coordsORS, // [lng, lat]
//         profile: "driving-car",
//         simplify: true,
//       }),
//     })
//       .then((r) => r.json())
//       .then((data) => {
//         // Бэк уже вернул [lat, lng]
//         setRoute(data?.route?.coordinates ?? null);
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <MapContainer
//       center={[37.8, -96]}
//       zoom={4}
//       style={{
//         width: "100%",
//         height: "400px",
//         borderRadius: "12px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//       }}
//       maxBounds={USA_BOUNDS}
//       maxBoundsViscosity={1.0}
//       scrollWheelZoom
//       minZoom={3}
//       maxZoom={18}
//       attributionControl
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//       />
//       {route && (
//         <>
//           <Polyline positions={route} />
//           <FitToRoute coords={route} />
//         </>
//       )}
//     </MapContainer>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** @typedef {[number, number]} LatLng */

const API_URL = "http://localhost:3001";

const USA_BOUNDS = [
  [24.396308, -125.0],    // SW
  [49.384358,  -66.93457] // NE
];

function FitToRoute({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (!coords || coords.length < 2) return;
    const bounds = L.polyline(coords).getBounds(); // robust bounds from path
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [coords, map]);
  return null;
}

export default function USAMap({ routeCoordinates = null }) {
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);

  // Example: LA -> Phoenix (send [lng, lat] to API)
  const coordsORS = useMemo(() => ([
    [-118.243683, 34.052235], // Los Angeles [lng, lat]
    [-112.074036, 33.448376], // Phoenix   [lng, lat]
  ]), []);

  const routeUrl = `${API_URL}/api/maps/route`;

  useEffect(() => {
    if (Array.isArray(routeCoordinates) && routeCoordinates.length >= 2) {
      setRoute(routeCoordinates);
      setError(null);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(routeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: coordsORS, // [lng, lat] for your backend/router
            profile: "driving-car",
            simplify: true,
          }),
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const coords = data?.route?.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) {
          throw new Error("Route missing or invalid");
        }
        // Expecting backend already returns [lat, lng]
        setRoute(coords);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Route fetch failed");
      }
    })();
    return () => ac.abort();
  }, [coordsORS, routeCoordinates]);

  const start = route?.[0];
  const end = route?.[route.length - 1];

  return (
    <MapContainer
      center={[37.8, -96]}
      zoom={4}
      style={{ width: "100%", height: 400, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      maxBounds={USA_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom
      minZoom={3}
      maxZoom={18}
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {error && (
        <div style={{ position: "absolute", top: 8, left: 8, background: "white", padding: 8, borderRadius: 8 }}>
          {error}
        </div>
      )}

      {route && (
        <>
          <Polyline
            positions={route}
            pathOptions={{ weight: 5, lineJoin: "round" }}
            // If you add the arrowheads plugin: arrowheads
          />
          {start && (
            <Marker position={start}>
              <Popup>Start</Popup>
            </Marker>
          )}
          {end && (
            <Marker position={end}>
              <Popup>End</Popup>
            </Marker>
          )}
          <FitToRoute coords={route} />
        </>
      )}
    </MapContainer>
  );
}

