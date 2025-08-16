console.log('MOUNT: AppFlow');


import React, { useState } from 'react';
import './App.css';
import { api } from './config.js';


export default function App() {
  const [form, setForm] = useState({ fromZip:'', toZip:'', moveDate:'' });
  const [view, setView] = useState('form'); // 1) состояние
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // примерные объёмы
const APT_TO_VOL = { studio: 5, '1br': 8, '2br': 12, '3br': 18, '4br': 24 };
const CONTAINER_VOL = { small: 7, medium: 10, large: 15 };

// вычисляем объём по квартире/контейнерам (берём максимум)
const volume = React.useMemo(() => {
  const vols = [];
  if (form.apartmentSize && APT_TO_VOL[form.apartmentSize]) vols.push(APT_TO_VOL[form.apartmentSize]);
  const cnt = Number(form.containers);
  const size = form.containerSize || 'medium';
  if (Number.isFinite(cnt) && cnt > 0 && CONTAINER_VOL[size]) vols.push(cnt * CONTAINER_VOL[size]);
  return vols.length ? Math.max(...vols) : 10;
}, [form.apartmentSize, form.containers, form.containerSize]);



  const onChange = (e) => setForm(s => ({...s, [e.target.name]: e.target.value}));

async function handleSearch() {
  try {
    setLoading(true);
    const token = localStorage.getItem('holly_token') || '';
    if (!token) {
      alert('Сначала войди (нет holly_token).');
      return;
    }

    const payload = {
      from: form.fromZip || 'Los Angeles, CA',
      to: form.toZip || 'San Diego, CA',
      date: form.moveDate || new Date().toISOString().slice(0, 10),
      volume,          // временно; позже подставим реальный расчёт
      needHelpers: true
    };

    const res = await fetch(api('/api/chat'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = await res.json();

    setPlan(data);
    setView('result'); // показываем новую страницу
  } catch (e) {
    console.error(e);
    alert('Ошибка запроса. Проверь токен/бэк.');
  } finally {
    setLoading(false);
  }
}

  // 3) новая страница после запроса
  if (view === 'result' && plan) {
    const { from, to, km, hours } = plan.itinerary;
    const { estTotal } = plan.pricing;
    return (
      <div style={{ padding:16 }}>
        <h2>Result view</h2>
        <div style={{ display:'grid', gridTemplateColumns:'380px 1fr', gap:16 }}>
          <section style={{ background:'#0b1220', color:'#fff', borderRadius:12, padding:16 }}>
            <div style={{ fontSize:42 }}>🚚</div>
            <div style={{ fontWeight:800, fontSize:20, marginTop:8 }}>Recommended truck</div>
            <div style={{ marginTop:12, lineHeight:1.6 }}>
              <div><b>Route:</b> {from} → {to}</div>
              <div><b>Distance/Time:</b> {km} km · ~{hours} h</div>
              <div><b>Estimated Price:</b> ${estTotal}</div>
            </div>
            <div style={{ marginTop:16 }}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`}
                target="_blank" rel="noreferrer"
                style={{ display:'inline-block', padding:'10px 14px', background:'#1d4ed8', color:'#fff', borderRadius:8, textDecoration:'none' }}
              >
                Open route in Google Maps
              </a>
            </div>
            <div style={{ marginTop:12 }}>
              <button onClick={() => setView('form')} style={{ padding:'10px 14px', borderRadius:8 }}>
                ← Change details
              </button>
            </div>
          </section>

          <section style={{ background:'#0b1220', color:'#fff', borderRadius:12, minHeight:300, display:'grid', placeItems:'center' }}>
            (map placeholder)
          </section>
        </div>
      </div>
    );
  }

  // страница формы
  return (
    <div className="app">
      <header className="header"><div className="container">
        <h1 className="logo">🏠 Holly Move</h1>
        <p className="tagline">Your magical moving companion!</p>
      </div></header>

      <main className="main"><div className="container">
        <section className="central-form" style={{ maxWidth:680, margin:'0 auto' }}>
          <h2>Form view</h2>
          <div className="move-form">
            <div className="form-row">
              <div className="form-field">
                <label>FROM (ZIP/City):</label>
                <input name="fromZip" value={form.fromZip} onChange={onChange} placeholder="90210 Los Angeles, CA" />
              </div>
              <div className="form-field">
                <label>TO (ZIP/City):</label>
                <input name="toZip" value={form.toZip} onChange={onChange} placeholder="10001 New York, NY" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>DATE:</label>
                <input type="date" name="moveDate" value={form.moveDate} onChange={onChange} />
              </div>
            </div>
            <button className="main-search-btn" onClick={handleSearch} disabled={loading}>
              🔍 FIND MY MOVERS
            </button>
          </div>
        </section>
      </div></main>
    </div>
  );
}
