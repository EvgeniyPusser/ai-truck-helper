import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapRoute from '../components/MapRoute.jsx';


export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Если попали сюда без state — возвращаем на главную
  useEffect(() => {
    if (!state?.route?.route?.line) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.route?.route?.line) return null;

  const { input, plan, route } = state;
  const line = route.route?.line || [];

  const dist = route.route.distance_km;
  const dur  = route.route.duration_h;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 16 }}>
        {/* Левая панель */}
        <div style={{ background: '#0b1220', color: '#e7f0ff', borderRadius: 12, padding: 16 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Your Moving Plan</h2>
          <div style={{ fontSize: 14, opacity: 0.9 }}>
            <div><b>From:</b> {route.from?.label || input?.from}</div>
            <div><b>To:</b> {route.to?.label || input?.to}</div>
            <div><b>Date:</b> {input?.date}</div>
            <div style={{ marginTop: 6 }}>
              <b>Distance:</b> {dist} km · <b>Drive:</b> {dur} h
            </div>
          </div>

          {plan?.pricing && (
            <div style={{ marginTop: 12 }}>
              <h3 style={{ margin: '12px 0 6px' }}>Pricing</h3>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div>🚛 Transport: <b>${plan.pricing.transport}</b></div>
                <div>👥 Labor: <b>${plan.pricing.labor}</b></div>
                <div>🛡️ Platform: <b>${plan.pricing.platformFee}</b></div>
                <div style={{ marginTop: 6, fontSize: 16 }}>
                  Total: <b>${plan.pricing.estTotal}</b>
                </div>
              </div>
            </div>
          )}

          {plan?.resources && (
            <div style={{ marginTop: 12 }}>
              <h3 style={{ margin: '12px 0 6px' }}>Resources</h3>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                {plan.resources.estimated_volume_m3 && (
                  <div>📦 Volume: <b>{plan.resources.estimated_volume_m3}</b> m³</div>
                )}
                {plan.resources.helpers && (
                  <div>🧑‍🔧 Helpers: <b>{plan.resources.helpers}</b></div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Правая панель — пока заглушка карты (саму карту добавим на шаге 5) */}
       <div>
  <MapRoute
    fromLabel={route.from?.label || input?.from}
    toLabel={route.to?.label || input?.to}
    line={line /* массив [lat,lng] из state.route.route.line */}
  />
  <div style={{ marginTop: 8, fontSize: 14 }}>
    <b>Distance:</b> {dist} km · <b>Drive:</b> {dur} h
  </div>
</div>

      </div>
    </div>
  );
}
