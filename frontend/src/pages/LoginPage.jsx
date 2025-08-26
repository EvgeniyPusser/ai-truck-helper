// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_LOGIN } from '../config.js';

export default function LoginPage() {
  const [email, setEmail] = useState('client@example.com');   // можно поменять
  const [password, setPassword] = useState('client123');      // можно поменять
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `Login failed: ${res.status}`);

      // сохраняем токен под обоими ключами для совместимости
      localStorage.setItem('holly_token', data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));

      navigate('/', { replace: true });
    } catch (e) {
      alert(e.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" style={{minHeight:'100vh'}}>
      <header className="header">
        <div className="container">
          <h1 className="logo">🔐 Login</h1>
          <p className="tagline">Sign in to get AI plan on every search</p>
        </div>
      </header>

      <main className="main">
        <div className="container" style={{maxWidth: 420, margin:'0 auto'}}>
          <form onSubmit={onSubmit} className="move-form">
            <div className="form-field">
              <label>Email</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <button className="main-search-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
