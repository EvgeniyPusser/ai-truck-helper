import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const USA_BOUNDS = [
  [24.396308, -125.0],
  [49.384358, -66.93457]
];



import { Polyline } from 'react-leaflet';

// Пример: маршрут из Нью-Йорка в Лос-Анджелес, 100 точек
const start = [40.7128, -74.0060]; // Нью-Йорк (lat, lng)
const end = [34.0522, -118.2437]; // Лос-Анджелес (lat, lng)
const pointsCount = 100;
const route = Array.from({ length: pointsCount }, (_, i) => [
  start[0] + (end[0] - start[0]) * (i / (pointsCount - 1)),
  start[1] + (end[1] - start[1]) * (i / (pointsCount - 1))
]);

export default function USAMap() {
  return (
    <MapContainer
      center={[37.8, -96]}
      zoom={4}
      style={{ width: '100%', height: '400px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      maxBounds={USA_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={true}
      minZoom={3}
      maxZoom={10}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Реальный маршрут (Polyline) */}
      <Polyline positions={route} color="red" />
    </MapContainer>
  );
}