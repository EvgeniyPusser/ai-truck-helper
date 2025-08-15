
import './App.css';
import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    fromZip: '',
    toZip: '',
    apartmentSize: '',
    moveDate: '',
    budget: '',
    truckSize: ''
  });
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // «старый» запрос: в /api/chat, volume оставляем как было (10)
  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('holly_token') || '';
      const payload = {
        from: formData.fromZip || 'Los Angeles, CA',
        to: formData.toZip || 'San Diego, CA',
        date: formData.moveDate || new Date().toISOString().slice(0, 10),
        volume: 10,
        needHelpers: true
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      setSearchResults(data);
      console.log('Plan:', data);
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка запроса. Убедись, что бэк на 3001 и ты залогинен.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeClick = (userType) => {
    console.log(`User clicked: ${userType}`);
    alert(`Welcome ${userType}! Dashboard coming soon...`);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="logo">🏠 Holly Move</h1>
          <p className="tagline">Your magical moving companion!</p>

          {/* Gnome Character */}
          <div className="gnome-mascot">
            <div className="gnome">🧙‍♂️</div>
            <div className="speech-bubble">
              "Welcome to America's smartest moving platform!"
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Главная секция - центральная форма с боковыми кнопками */}
          <div className="main-layout">
            {/* Левые кнопки юзеров */}
            <div className="side-users left">
              <button className="user-btn helper" onClick={() => handleUserTypeClick('Helper')}>🤝</button>
              <button className="user-btn truck" onClick={() => handleUserTypeClick('Truck Owner')}>🚛</button>
            </div>

            {/* Центральная форма */}
            <section className="central-form">
              <h2>🇺🇸 Holly Move - AI Moving Assistant</h2>

              <div className="move-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>📍 FROM (ZIP Code):</label>
                    <input
                      type="text"
                      name="fromZip"
                      value={formData.fromZip}
                      onChange={handleInputChange}
                      placeholder="90210 Los Angeles, CA"
                    />
                  </div>
                  <div className="form-field">
                    <label>🎯 TO (ZIP Code):</label>
                    <input
                      type="text"
                      name="toZip"
                      value={formData.toZip}
                      onChange={handleInputChange}
                      placeholder="10001 New York, NY"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>🏠 APARTMENT SIZE:</label>
                    <select name="apartmentSize" value={formData.apartmentSize} onChange={handleInputChange}>
                      <option value="">Select Size</option>
                      <option value="studio">Studio (400-600 sq ft)</option>
                      <option value="1br">1BR (600-800 sq ft)</option>
                      <option value="2br">2BR (800-1200 sq ft)</option>
                      <option value="3br">3BR (1200-1600 sq ft)</option>
                      <option value="4br">4BR+ (1600+ sq ft)</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>📅 WHEN (Moving Date):</label>
                    <input
                      type="date"
                      name="moveDate"
                      value={formData.moveDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>💰 BUDGET (Estimate):</label>
                    <select name="budget" value={formData.budget} onChange={handleInputChange}>
                      <option value="">Select Budget</option>
                      <option value="500-1000">$500-1,000</option>
                      <option value="1000-2500">$1,000-2,500</option>
                      <option value="2500-5000">$2,500-5,000</option>
                      <option value="5000+">$5,000+ Premium</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>🚛 TRUCK SIZE:</label>
                    <select name="truckSize" value={formData.truckSize} onChange={handleInputChange}>
                      <option value="">Select Truck</option>
                      <option value="10ft">10ft Truck (Studio-1BR)</option>
                      <option value="14ft">14ft Truck (1-2BR)</option>
                      <option value="17ft">17ft Truck (2-3BR)</option>
                      <option value="26ft">26ft Truck (3BR+)</option>
                    </select>
                  </div>
                </div>

                <button
                  className="main-search-btn"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? '🔄 SEARCHING...' : '🔍 FIND MY MOVERS'}
                </button>

                {searchResults && (
                  <pre style={{ marginTop: 16, padding: 12, background: '#111', color: '#0f0', borderRadius: 8, overflowX: 'auto' }}>
                    {JSON.stringify(searchResults, null, 2)}
                  </pre>
                )}
              </div>
            </section>

            {/* Правые кнопки юзеров */}
            <div className="side-users right">
              <button className="user-btn company" onClick={() => handleUserTypeClick('Company')}>🏢</button>
              <button className="user-btn agent" onClick={() => handleUserTypeClick('Agent')}>👔</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
