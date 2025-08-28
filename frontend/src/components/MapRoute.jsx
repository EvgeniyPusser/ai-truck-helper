// import { useEffect, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// export default function MapRoute({ fromLabel, toLabel, line }) {
//   const elRef = useRef(null);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     // Инициализация карты один раз
//     if (!mapRef.current && elRef.current) {
//       mapRef.current = L.map(elRef.current, { zoomControl: true }).setView([39.5, -98.5], 4);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//         crossOrigin: true
//       }).addTo(mapRef.current);
//     }
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current) return;
//     const map = mapRef.current;

//     // очистить старые слои (линии/маркеры)
//     const toRemove = [];
//     map.eachLayer((l) => {
//       if (l instanceof L.Polyline || l instanceof L.Marker || l instanceof L.CircleMarker) toRemove.push(l);
//     });
//     toRemove.forEach((l) => map.removeLayer(l));

//     if (Array.isArray(line) && line.length > 1) {
//       const poly = L.polyline(line, { color: '#3366FF', weight: 6, opacity: 0.85 }).addTo(map);
//       L.marker(line[0]).addTo(map).bindPopup(`<strong>From</strong><br>${fromLabel || ''}`);
//       L.marker(line[line.length - 1]).addTo(map).bindPopup(`<strong>To</strong><br>${toLabel || ''}`);
//       map.fitBounds(poly.getBounds(), { padding: [40, 40] });
//     }
//   }, [line, fromLabel, toLabel]);

//   return (
//     <div
//       ref={elRef}
//       style={{ width: '100%', height: 420, borderRadius: 8, overflow: 'hidden', background: '#eee' }}
//     />
//   );



// frontend/src/components/MapRoute.jsx
import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фикс дефолтных иконок Leaflet (если нет своих)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Упрощаем линию (берём каждую N-ю точку) — сильно ускоряет рендер
function simplify(arr, step = 3) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
  if (arr.length) out.push(arr[arr.length - 1]);
  return out;
}

// Однократный fitBounds, когда линия готова
function FitOnData({ latlngs }) {
  const map = useMap();
  useEffect(() => {
    if (!latlngs || latlngs.length < 2) return;
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, latlngs]);
  return null;
}

export default function MapRoute({ line }) {
  // Безопасный центр, чтобы карта не "скакала" до fitBounds
  const center = useMemo(() => [34.0522, -118.2437], []);
  const simplified = useMemo(() => simplify(line || [], 3), [line]);

  // Маркеры из концов линии (если есть)
  const fromLL = useMemo(
    () => (simplified?.length ? simplified[0] : null),
    [simplified]
  );
  const toLL = useMemo(
    () => (simplified?.length ? simplified[simplified.length - 1] : null),
    [simplified]
  );

  return (
    <div id="map-root" style={{ height: '70vh', width: '100%', borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={8} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle
        />

        {simplified && simplified.length >= 2 && (
          <>
            <Polyline positions={simplified} />
            <FitOnData latlngs={simplified} />
          </>
        )}

        {fromLL && <Marker position={fromLL} icon={defaultIcon} />}
        {toLL && <Marker position={toLL} icon={defaultIcon} />}

        {/* Подписи можно добавить через Popup, если нужно:
        {fromLL && <Marker position={fromLL} icon={defaultIcon}><Popup>{fromLabel}</Popup></Marker>}
        */}
      </MapContainer>
    </div>
  );
}
