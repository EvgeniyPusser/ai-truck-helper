import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapRoute({ fromLabel, toLabel, line }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Инициализация карты один раз
    if (!mapRef.current && elRef.current) {
      mapRef.current = L.map(elRef.current, { zoomControl: true }).setView([39.5, -98.5], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        crossOrigin: true
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // очистить старые слои (линии/маркеры)
    const toRemove = [];
    map.eachLayer((l) => {
      if (l instanceof L.Polyline || l instanceof L.Marker || l instanceof L.CircleMarker) toRemove.push(l);
    });
    toRemove.forEach((l) => map.removeLayer(l));

    if (Array.isArray(line) && line.length > 1) {
      const poly = L.polyline(line, { color: '#3366FF', weight: 6, opacity: 0.85 }).addTo(map);
      L.marker(line[0]).addTo(map).bindPopup(`<strong>From</strong><br>${fromLabel || ''}`);
      L.marker(line[line.length - 1]).addTo(map).bindPopup(`<strong>To</strong><br>${toLabel || ''}`);
      map.fitBounds(poly.getBounds(), { padding: [40, 40] });
    }
  }, [line, fromLabel, toLabel]);

  return (
    <div
      ref={elRef}
      style={{ width: '100%', height: 420, borderRadius: 8, overflow: 'hidden', background: '#eee' }}
    />
  );
}
