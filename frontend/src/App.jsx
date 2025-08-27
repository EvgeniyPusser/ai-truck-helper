import React, { useMemo, useState } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ResultPage from './pages/ResultPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { api, API_CHAT } from './config.js';

function useToken() {
  const get = () =>
    localStorage.getItem('holly_token') ||
    localStorage.getItem('token') ||
    '';
  const [tok, setTok] = useState(get());
  const refresh = () => setTok(get());
  const clear = () => {
    localStorage.removeItem('holly_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTok('');
  };
  return { token: tok, refresh, clear };
}

const parseJsonSafe = async (res) => {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return null;
  try { return await res.json(); } catch { return null; }
};

function Landing() {
  const [form, setForm] = useState({ fromZip: '', toZip: '', moveDate: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useToken();

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
      const payload = {
        from: form.fromZip || 'Los Angeles, CA',
        to: form.toZip || 'San Diego, CA',
        date: form.moveDate || new Date().toISOString().slice(0, 10),
        volume,
        needHelpers: true,
      };

      // 1) Маршрут — всегда, через наш бэк
      const mapRes = await fetch(api('/api/maps/route'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: payload.from, to: payload.to }),
      });
      const route = await mapRes.json().catch(() => null);
      if (!mapRes.ok || !route?.ok) {
        throw new Error(route?.error || `route status ${mapRes.status}`);
      }

      // 2) ИИ-план — только если есть токен; 401 игнорируем
      let plan = null;
      if (token) {
        try {
          const aiRes = await fetch(API_CHAT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          if (aiRes.ok) {
            plan = await parseJsonSafe(aiRes);
          } else if (aiRes.status === 401) {
            console.warn('AI plan requires login (401) — skipping');
          } else {
            console.warn('AI failed', aiRes.status, await aiRes.text());
          }
        } catch (e) {
          console.warn('AI request error:', e);
        }
      }

      // 3) Переход на страницу результата
      navigate('/result', { state: { input: payload, plan, route } });
    } catch (e) {
      console.error('Search error:', e);
      alert(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 className="logo">🏠 Holly Move</h1>
            <p className="tagline">Your magical moving companion!</p>
          </div>
          <nav>
            <Link to="/login">{token ? 'Re-login' : 'Login'}</Link>
          </nav>
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}