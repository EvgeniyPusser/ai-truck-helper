import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import truckImg from '../assets/truck.png';

const USA_BOUNDS = [
  [24.396308, -125.0],
  [49.384358, -66.93457]
];

const truckIcon = new L.Icon({
  iconUrl: truckImg,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function TruckMarker({ route }) {
  const [posIdx, setPosIdx] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (!route || route.length === 0) return;
    setPosIdx(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPosIdx(idx => (idx < route.length - 1 ? idx + 1 : idx));
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [route]);

  if (!route || route.length === 0) return null;
  return <Marker position={route[posIdx]} icon={truckIcon} />;
}

export default function USAMap() {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coordinates: [
          [-74.0060, 40.7128], // Нью-Йорк (lng, lat)
          [-118.2437, 34.0522] // Лос-Анджелес (lng, lat)
        ]
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.features && data.features[0]) {
          const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRoute(coords);
        }
      });
  }, []);

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
      {/* Маршрут */}
      {route.length > 0 && <Polyline positions={route} color="red" />}
      {/* Анимированный грузовичок */}
      <TruckMarker route={route} />
    </MapContainer>
  );
}