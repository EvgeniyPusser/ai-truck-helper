import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** @typedef {[number, number]} LatLng */

const USA_BOUNDS: [LatLng, LatLng] = [
  [24.396308, -125.0],    // SW
  [49.384358,  -66.93457] // NE
];

function FitToRoute({ coords }: { coords: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (!coords || coords.length < 2) return;
    const bounds = L.polyline(coords).getBounds(); // robust bounds from path
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [coords, map]);
  return null;
}

type RouteResp = { route?: { coordinates?: LatLng[] } };

export default function USAMap() {
  const [route, setRoute] = useState<LatLng[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Example: LA -> Phoenix (send [lng, lat] to API)
  const coordsORS = useMemo<[number, number][]>(() => ([
    [-118.243683, 34.052235], // Los Angeles [lng, lat]
    [-112.074036, 33.448376], // Phoenix   [lng, lat]
  ]), []);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/maps/route", {
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
        const data: RouteResp = await res.json();

        const coords = data?.route?.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) {
          throw new Error("Route missing or invalid");
        }
        // Expecting backend already returns [lat, lng]
        setRoute(coords as LatLng[]);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Route fetch failed");
      }
    })();
    return () => ac.abort();
  }, [coordsORS]);

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
        // For production, consider a provider or your own tiles;
        // avoid hardcoding OSM tiles per OSMF policy.
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

