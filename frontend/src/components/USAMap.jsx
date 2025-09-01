
// import { MapContainer, TileLayer } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// const USA_BOUNDS = [
//   [24.396308, -125.0],
//   [49.384358, -66.93457]
// ];

// export default function USAMap() {
//   return (
//     <MapContainer
//       center={[37.8, -96]}
//       zoom={4}
//       style={{ width: '100%', height: '400px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
//       maxBounds={USA_BOUNDS}
//       maxBoundsViscosity={1.0}
//       scrollWheelZoom={true}
//       minZoom={3}
//       maxZoom={10}
//       attributionControl={false}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//     </MapContainer>
//   );
// }

// ...existing code...
// @ts-nocheck.
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/** @typedef {[number, number]} LatLng */

const USA_BOUNDS = [
  [24.396308, -125.0],
  [49.384358, -66.93457],
];

/**
 * @param {{ coords: LatLng[] }} props
 */
function FitToRoute({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (!coords || coords.length < 2) return;
    map.fitBounds(coords, { padding: [20, 20] });
  }, [coords, map]);
  return null;
}

export default function USAMap() {
  /** @type {[LatLng[] | null, Function]} */
  const [route, setRoute] = useState(null);

  useEffect(() => {
    // Пример: LA -> Phoenix (координаты строго [lng, lat] для запроса)
    /** @type {Array<[number, number]>} */
    const coordsORS = [
      [-118.243683, 34.052235], // Los Angeles [lng, lat]
      [-112.074036, 33.448376], // Phoenix [lng, lat]
    ];

    fetch(`/api/maps/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coordinates: coordsORS, // [lng, lat]
        profile: "driving-car",
        simplify: true,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        // Бэк уже вернул [lat, lng]
        setRoute(data?.route?.coordinates ?? null);
      })
      .catch(console.error);
  }, []);

  return (
    <MapContainer
      center={[37.8, -96]}
      zoom={4}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      maxBounds={USA_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      minZoom={3}
      maxZoom={18}
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {route && (
        <>
          <Polyline positions={route} />
          <FitToRoute coords={route} />
        </>
      )}
    </MapContainer>
  );
}
