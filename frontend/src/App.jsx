// frontend/src/App.jsx
import React, { useMemo, useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ResultPage from './pages/ResultPage.jsx';

function Landing() {
  const [form, setForm] = useState({ fromZip: '', toZip: '', moveDate: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Черновой мэппинг объёма
  const APT_TO_VOL = { studio: 5, '1br': 8, '2br': 12, '3br': 18, '4br': 24 };
  const CONTAINER_VOL = { small: 7, medium: 10, large: 15 };

  const volume = useMemo(() => {
    const vols = [];
    if (form.apartmentSize && APT_TO_VOL[form.apartmentSize]) vols.push(APT_TO_VOL[form.apartmentSize]);
    const cnt = Number(form.containers);
    const size = form.containerSize || 'medium';
    if (Number.isFinite(cnt) && cnt > 0 && CONTAINER_VOL[size]) vols.push(cnt * CONTAINER_VOL[size]);
    return vols.length ? Math.max(...vols) : 10;
  }, [form.apartmentSize, form.containers, form.containerSize]);

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('holly_token') || localStorage.getItem('token') || '';

      const payload = {
        from: form.fromZip || 'Los Angeles, CA',
        to: form.toZip || 'San Diego, CA',
        date: form.moveDate || new Date().toISOString().slice(0, 10),
        volume,
        needHelpers: true,
      };

      // 1) Маршрут — обязательно
      const mapRes = await fetch('/api/maps/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: payload.from, to: payload.to }),
      });
      const route = await mapRes.json();
      if (!mapRes.ok || !route.ok) throw new Error(route.error || `route status ${mapRes.status}`);

      // 2) ИИ-план — опционально (если есть токен)
      let plan = null;
      if (token) {
        try {
          const aiRes = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });
          if (aiRes.ok) plan = await aiRes.json();
          else console.warn('AI request failed:', aiRes.status);
        } catch (e) {
          console.warn('AI request error:', e);
        }
      } else {
        console.warn('No token found — skipping /api/chat');
      }

      // 3) Переход на страницу результата
      navigate('/result', { state: { input: payload, plan, route } });
    } catch (e) {
      console.error('Search error:', e);
      alert(e.message?.includes('route') ? 'Маршрут не построился. Проверь адреса.' : 'Ошибка. Проверь сервер (3001).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">🏠 Holly Move</h1>
          <p className="tagline">Your magical moving companion!</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="central-form" style={{ maxWidth: 680, margin: '0 auto' }}>
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
                {loading ? '🔄 SEARCHING...' : '🔍 FIND MY MOVERS'}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}


