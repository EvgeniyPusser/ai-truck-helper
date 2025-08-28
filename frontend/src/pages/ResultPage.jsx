// import { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import MapRoute from '../components/MapRoute.jsx';


// export default function ResultPage() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   // Если попали сюда без state — возвращаем на главную
//   useEffect(() => {
//     if (!state?.route?.route?.line) {
//       navigate('/', { replace: true });
//     }
//   }, [state, navigate]);

//   if (!state?.route?.route?.line) return null;

//   const { input, plan, route } = state;
//   const line = route.route?.line || [];

//   const dist = route.route.distance_km;
//   const dur  = route.route.duration_h;

//   return (
//     <div style={{ padding: 20 }}>
//       <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>

//       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 16 }}>
//         {/* Левая панель */}
//         <div style={{ background: '#0b1220', color: '#e7f0ff', borderRadius: 12, padding: 16 }}>
//           <h2 style={{ margin: 0, marginBottom: 8 }}>Your Moving Plan</h2>
//           <div style={{ fontSize: 14, opacity: 0.9 }}>
//             <div><b>From:</b> {route.from?.label || input?.from}</div>
//             <div><b>To:</b> {route.to?.label || input?.to}</div>
//             <div><b>Date:</b> {input?.date}</div>
//             <div style={{ marginTop: 6 }}>
//               <b>Distance:</b> {dist} km · <b>Drive:</b> {dur} h
//             </div>
//           </div>

//           {plan?.pricing && (
//             <div style={{ marginTop: 12 }}>
//               <h3 style={{ margin: '12px 0 6px' }}>Pricing</h3>
//               <div style={{ fontSize: 14, lineHeight: 1.6 }}>
//                 <div>🚛 Transport: <b>${plan.pricing.transport}</b></div>
//                 <div>👥 Labor: <b>${plan.pricing.labor}</b></div>
//                 <div>🛡️ Platform: <b>${plan.pricing.platformFee}</b></div>
//                 <div style={{ marginTop: 6, fontSize: 16 }}>
//                   Total: <b>${plan.pricing.estTotal}</b>
//                 </div>
//               </div>
//             </div>
//           )}

//           {plan?.resources && (
//             <div style={{ marginTop: 12 }}>
//               <h3 style={{ margin: '12px 0 6px' }}>Resources</h3>
//               <div style={{ fontSize: 14, lineHeight: 1.6 }}>
//                 {plan.resources.estimated_volume_m3 && (
//                   <div>📦 Volume: <b>{plan.resources.estimated_volume_m3}</b> m³</div>
//                 )}
//                 {plan.resources.helpers && (
//                   <div>🧑‍🔧 Helpers: <b>{plan.resources.helpers}</b></div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Правая панель — пока заглушка карты (саму карту добавим на шаге 5) */}
//        <div>
//   <MapRoute
//     fromLabel={route.from?.label || input?.from}
//     toLabel={route.to?.label || input?.to}
//     line={line /* массив [lat,lng] из state.route.route.line */}
//   />
//   <div style={{ marginTop: 8, fontSize: 14 }}>
//     <b>Distance:</b> {dist} km · <b>Drive:</b> {dur} h
//   </div>
// </div>

//       </div>
//     </div>
//   );
// }

// frontend/src/pages/ResultPage.jsx
import React, { useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Фикс для дефолтного маркера (если нет своих картинок)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitOnData({ latlngs }) {
  const map = useMap();
  useEffect(() => {
    if (!latlngs || !latlngs.length) return;
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, latlngs]);
  return null;
}

function simplify(arr, step = 3) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
  if (arr.length) out.push(arr[arr.length - 1]);
  return out;
}

export default function ResultPage() {
  const { state } = useLocation();
  const input = state?.input || null;   // { from, to, date, volume, ... }
  const plan  = state?.plan  || null;
  const route = state?.route || null;   // { ok, from:{lat,lon,label}, to:{...}, route:{ line:[[lat,lon],...], ... } }

  // Безопасные значения
  const line = useMemo(() => simplify(route?.route?.line || [], 3), [route]);
  const fromLL = useMemo(() => {
    const a = route?.from;
    return a?.lat && a?.lon ? [a.lat, a.lon] : null;
  }, [route]);
  const toLL = useMemo(() => {
    const b = route?.to;
    return b?.lat && b?.lon ? [b.lat, b.lon] : null;
  }, [route]);

  // Центр по умолчанию (LA), чтобы карта не мигала до FitOnData
  const center = useMemo(() => [34.0522, -118.2437], []);

  return (
    <div className="result-page" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2>Your result</h2>
        <Link to="/">← Back</Link>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div><b>From:</b> {input?.from || route?.from?.label}</div>
        <div><b>To:</b> {input?.to || route?.to?.label}</div>
        {route?.route?.distance_km != null && (
          <div><b>Distance:</b> {route.route.distance_km} km</div>
        )}
        {route?.route?.duration_h != null && (
          <div><b>ETA:</b> {route.route.duration_h} h</div>
        )}
      </div>

      {/* Карта в стабильном контейнере фиксированной высоты */}
      <div id="map-root" style={{ height: '70vh', width: '100%', borderRadius: 12, overflow: 'hidden' }}>
        <MapContainer center={center} zoom={8} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            updateWhenIdle
          />
          {line && line.length >= 2 && (
            <>
              <Polyline positions={line} />
              <FitOnData latlngs={line} />
            </>
          )}
          {fromLL && <Marker position={fromLL} icon={defaultIcon} />}
          {toLL && <Marker position={toLL} icon={defaultIcon} />}
        </MapContainer>
      </div>

      {/* Блок плана от ИИ — если есть */}
      {plan ? (
        <div style={{ marginTop: 16 }}>
          <h3>AI plan (beta)</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
