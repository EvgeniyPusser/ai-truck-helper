// HolyMove Frontend - Connected to Express.js Backend
class HolyMoveApp {
    constructor() {
        this.baseURL = 'http://localhost:3001/api';
        this.token = localStorage.getItem('token');
        this.user = null;
        this.map = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.initMap();
    }

    setupEventListeners() {
        // Login
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        // Demo users
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const email = e.target.dataset.email;
                const password = e.target.dataset.password;
                document.getElementById('email').value = email;
                document.getElementById('password').value = password;
            });
        });

        // Quote request
        document.getElementById('get-quote-btn').addEventListener('click', () => this.getQuote());
        
        // Home size selector
        document.getElementById('homeSize').addEventListener('change', (e) => {
            const customVolume = document.getElementById('customVolume');
            if (e.target.value === 'custom') {
                customVolume.style.display = 'block';
                customVolume.required = true;
            } else {
                customVolume.style.display = 'none';
                customVolume.required = false;
            }
        });

        // ZIP code formatting
        ['fromZip', 'toZip'].forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
            });
        });
        
        // Enter key in login
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('moveDate').min = today;
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
            
            this.showMainSection();
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials.');
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.showLoginSection();
    }

    checkAuth() {
        if (this.token) {
            try {
                this.user = JSON.parse(localStorage.getItem('user'));
                this.showMainSection();
            } catch (error) {
                this.logout();
            }
        } else {
            this.showLoginSection();
        }
    }

    showLoginSection() {
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('main-section').classList.add('hidden');
    }

    showMainSection() {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-section').classList.remove('hidden');
        
        // Update user info
        document.getElementById('user-role').textContent = this.user.role;
        
        // Show admin panel if admin
        if (this.user.role === 'admin') {
            document.getElementById('admin-panel').classList.remove('hidden');
            this.loadRoles();
        } else {
            document.getElementById('admin-panel').classList.add('hidden');
        }
    }

    async loadRoles() {
        try {
            const response = await fetch(`${this.baseURL}/roles`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const rolesList = document.getElementById('roles-list');
                rolesList.innerHTML = data.roles.map(role => 
                    `<span class="role-badge">${role}</span>`
                ).join('');
            }
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    }

    async getQuote() {
        const fromZip = document.getElementById('fromZip').value;
        const toZip = document.getElementById('toZip').value;
        const fromAddress = document.getElementById('fromAddress').value;
        const toAddress = document.getElementById('toAddress').value;
        const moveDate = document.getElementById('moveDate').value;
        const homeSize = document.getElementById('homeSize').value;
        const customVolume = document.getElementById('customVolume').value;
        const needMovers = document.getElementById('needMovers').checked;
        const needPacking = document.getElementById('needPacking').checked;
        const needStorage = document.getElementById('needStorage').checked;

        // Validation
        if (!fromZip || !toZip || !moveDate || !homeSize) {
            alert('Please fill in all required fields (ZIP codes, date, and home size)');
            return;
        }

        if (fromZip.length !== 5 || toZip.length !== 5) {
            alert('Please enter valid 5-digit ZIP codes');
            return;
        }

        if (homeSize === 'custom' && !customVolume) {
            alert('Please enter custom volume for your move');
            return;
        }

        const button = document.getElementById('get-quote-btn');
        const originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Calculating quote...';
        button.disabled = true;

        try {
            // Create full addresses
            const fromLocation = fromAddress ? `${fromAddress}, ${fromZip}` : fromZip;
            const toLocation = toAddress ? `${toAddress}, ${toZip}` : toZip;

            // Convert home size to volume
            let volume;
            const sizeToVolume = {
                'studio': 15,      // ~500 cubic feet
                '1bedroom': 25,    // ~900 cubic feet  
                '2bedroom': 35,    // ~1200 cubic feet
                '3bedroom': 50,    // ~1600 cubic feet
                '4bedroom': 70,    // ~2000+ cubic feet
                'custom': parseFloat(customVolume)
            };
            volume = sizeToVolume[homeSize];

            // Add user message to chat
            this.addMessage('user', 
                `Moving quote request:<br>
                📍 From: ${fromLocation}<br>
                📍 To: ${toLocation}<br>
                📅 Date: ${new Date(moveDate).toLocaleDateString('en-US')}<br>
                🏠 Size: ${homeSize === 'custom' ? `${volume} cubic feet` : homeSize}<br>
                ${needMovers ? '✅ Professional movers needed<br>' : ''}
                ${needPacking ? '✅ Packing services needed<br>' : ''}
                ${needStorage ? '✅ Storage services needed<br>' : ''}`
            );

            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    from: fromLocation,
                    to: toLocation,
                    date: moveDate,
                    volume: volume,
                    needHelpers: needMovers,
                    needPacking: needPacking,
                    needStorage: needStorage,
                    homeSize: homeSize
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response from server:', data); // Debug log
            
            // Check specifically for geometry data
            if (data.itinerary && data.itinerary.geometry) {
                console.log('Found geometry in itinerary:', data.itinerary.geometry);
                console.log('Geometry type:', data.itinerary.geometry.type);
                console.log('Coordinates count:', data.itinerary.geometry.coordinates ? data.itinerary.geometry.coordinates.length : 'No coordinates');
            } else if (data.geometry) {
                console.log('Found geometry at root level:', data.geometry);
            } else {
                console.log('No geometry found in response');
            }
            
            // Add AI response to chat
            this.addMessage('assistant', this.formatQuoteResponse(data));
            
            // Try to show route with proper geometry structure
            let routeGeometry = null;
            if (data.itinerary && data.itinerary.geometry && data.itinerary.geometry.coordinates) {
                routeGeometry = data.itinerary.geometry;
            } else if (data.geometry && data.geometry.coordinates) {
                routeGeometry = data.geometry;
            }
            
            if (routeGeometry && routeGeometry.coordinates && routeGeometry.coordinates.length > 0) {
                // We have route geometry from AI
                console.log('Showing route with geometry:', routeGeometry.coordinates.length, 'points');
                this.showRoute(routeGeometry, fromLocation, toLocation);
            } else {
                // No geometry, show ZIP code locations
                console.log('No geometry data, showing ZIP code locations');
                await this.showZipCodeLocations(fromLocation, toLocation);
            }

        } catch (error) {
            console.error('Quote request error:', error);
            this.addMessage('assistant', 
                `I apologize, but I encountered an error processing your moving quote. 
                 <br><br>Error details: ${error.message}
                 <br><br>Please try again or contact our support team at support@holymove.com`
            );
            
            // Still try to show map locations even if quote failed
            try {
                const fromLocation = fromAddress ? `${fromAddress}, ${fromZip}` : fromZip;
                const toLocation = toAddress ? `${toAddress}, ${toZip}` : toZip;
                await this.showZipCodeLocations(fromLocation, toLocation);
            } catch (mapError) {
                console.error('Map error:', mapError);
            }
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatQuoteResponse(data) {
        // New server response structure: { itinerary, resources, pricing, narrative }
        if (data.itinerary && data.pricing) {
            const { itinerary, resources, pricing } = data;
            return `
                <div class="quote-response">
                    <div class="gnome-quote-header">
                        <span class="gnome-character">🧙‍♂️</span>
                        <h4>✨ Your Magical Moving Quote & Price List ✨</h4>
                    </div>
                    
                    <!-- Route Information -->
                    <div class="route-info">
                        <h5>📍 Route Details</h5>
                        <p><strong>From:</strong> ${itinerary.from}</p>
                        <p><strong>To:</strong> ${itinerary.to}</p>
                        <p><strong>Distance:</strong> ${itinerary.miles} miles (${itinerary.km} km)</p>
                        <p><strong>Drive Time:</strong> ${itinerary.drive_time_h} hours</p>
                        <p><strong>Move Date:</strong> ${new Date(itinerary.date).toLocaleDateString('en-US')}</p>
                    </div>

                    <!-- Gnome's Price Wisdom -->
                    <div class="gnome-wisdom">
                        <span class="gnome-icon">🧙‍♂️</span>
                        <div class="wisdom-text">
                            "As your magical moving advisor, I've calculated the most fair and transparent pricing for your journey!"
                        </div>
                    </div>

                    <!-- Detailed Price List -->
                    <div class="price-list">
                        <h5>💰 Magical Price List</h5>
                        <table class="pricing-table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>🚛 Transportation</strong></td>
                                    <td>Professional truck and driver</td>
                                    <td>$${pricing.transport}</td>
                                </tr>
                                <tr>
                                    <td><strong>👥 Labor</strong></td>
                                    <td>${resources.helpers} magical helpers @ 4 hours</td>
                                    <td>$${pricing.labor}</td>
                                </tr>
                                <tr>
                                    <td><strong>🛡️ Platform Fee</strong></td>
                                    <td>Service coordination and insurance</td>
                                    <td>$${pricing.platformFee}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="total-price">
                            <span class="gnome-icon">🧙‍♂️</span>
                            <strong>Total Magical Cost: $${pricing.estTotal}</strong>
                        </div>
                    </div>

                    <!-- Truck Options -->
                    <div class="truck-options">
                        <h5>🚛 Enchanted Truck Options</h5>
                        ${this.generateTruckOptions()}
                    </div>

                    ${resources && resources.estimated_volume_m3 ?
                        `<div class="resources-info">
                            <h5>📦 Volume Estimate</h5>
                            <p><strong>Estimated Volume:</strong> ${resources.estimated_volume_m3} cubic meters</p>
                            <p><strong>Magical Helpers:</strong> ${resources.helpers} professional gnome assistants</p>
                        </div>` : ''}

                    ${data.narrative ? 
                        `<div class="ai-advice">
                            <h5>�‍♂️ Gnome's Wisdom</h5>
                            <p>${data.narrative}</p>
                        </div>` : ''}

                    <div class="gnome-footer">
                        <span class="gnome-character">🧙‍♂️</span>
                        <em>"Remember: Every great journey begins with a single magical step!"</em>
                    </div>
                </div>
            `;
        } else if (data.message) {
            return `<div class="quote-response">${data.message}</div>`;
        } else {
            return '<div class="quote-response">Your moving quote has been processed successfully! Our team will contact you with detailed pricing.</div>';
        }
    }

    generatePriceList(summary) {
        const baseServices = [
            { name: 'Base Moving Service', desc: 'Professional movers and truck', price: this.calculateBasePrice(summary.distance_km) },
            { name: 'Fuel & Mileage', desc: `${summary.distance_km} miles @ $0.75/mile`, price: (summary.distance_km * 0.75).toFixed(2) },
            { name: 'Insurance Coverage', desc: 'Basic moving insurance', price: '45.00' },
        ];

        // Add optional services based on user selections
        const optionalServices = [];
        
        if (document.getElementById('needMovers')?.checked) {
            optionalServices.push({ name: 'Professional Movers', desc: '2-3 movers for loading/unloading', price: '150.00' });
        }
        
        if (document.getElementById('needPacking')?.checked) {
            optionalServices.push({ name: 'Packing Services', desc: 'Professional packing materials & service', price: '200.00' });
        }
        
        if (document.getElementById('needStorage')?.checked) {
            optionalServices.push({ name: 'Temporary Storage', desc: '30-day climate controlled storage', price: '120.00' });
        }

        const allServices = [...baseServices, ...optionalServices];
        
        return allServices.map(service => `
            <tr>
                <td class="service-name">${service.name}</td>
                <td class="service-desc">${service.desc}</td>
                <td class="service-price">$${service.price}</td>
            </tr>
        `).join('');
    }

    calculateBasePrice(distance) {
        // Base price calculation based on distance
        if (distance < 50) return '199.00';
        if (distance < 100) return '299.00';
        if (distance < 300) return '499.00';
        if (distance < 500) return '699.00';
        if (distance < 1000) return '999.00';
        return '1299.00';
    }

    calculateTotal(summary) {
        let total = parseFloat(this.calculateBasePrice(summary.distance_km));
        total += summary.distance_km * 0.75; // Fuel
        total += 45; // Insurance
        
        if (document.getElementById('needMovers')?.checked) total += 150;
        if (document.getElementById('needPacking')?.checked) total += 200;
        if (document.getElementById('needStorage')?.checked) total += 120;
        
        return `$${total.toFixed(2)}`;
    }

    generateTruckOptions() {
        const homeSize = document.getElementById('homeSize')?.value || 'studio';
        
        const truckOptions = {
            'studio': [
                { type: 'Magical Pickup Truck', size: '6ft bed', capacity: '500 cu ft', price: '$89/day', suitable: true, gnomeAdvice: 'Perfect for studio magic!' },
                { type: 'Enchanted Cargo Van', size: '10ft cargo', capacity: '400 cu ft', price: '$99/day', suitable: true, gnomeAdvice: 'Cozy and efficient!' },
                { type: 'Small Moving Truck', size: '12ft box', capacity: '450 cu ft', price: '$129/day', suitable: false, gnomeAdvice: 'A bit too big for this spell' }
            ],
            '1bedroom': [
                { type: 'Enchanted Cargo Van', size: '10ft cargo', capacity: '400 cu ft', price: '$99/day', suitable: false, gnomeAdvice: 'Might need extra magic!' },
                { type: 'Magical Moving Truck', size: '12ft box', capacity: '450 cu ft', price: '$129/day', suitable: true, gnomeAdvice: 'Just right for 1-bedroom spells!' },
                { type: 'Medium Magic Truck', size: '16ft box', capacity: '800 cu ft', price: '$169/day', suitable: true, gnomeAdvice: 'Extra space for treasures!' }
            ],
            '2bedroom': [
                { type: 'Small Moving Truck', size: '12ft box', capacity: '450 cu ft', price: '$129/day', suitable: false, gnomeAdvice: 'Too small for this adventure' },
                { type: 'Magical Medium Truck', size: '16ft box', capacity: '800 cu ft', price: '$169/day', suitable: true, gnomeAdvice: 'Perfect for 2-bedroom magic!' },
                { type: 'Large Enchanted Truck', size: '20ft box', capacity: '1200 cu ft', price: '$219/day', suitable: true, gnomeAdvice: 'Room for all your magical items!' }
            ],
            '3bedroom': [
                { type: 'Medium Magic Truck', size: '16ft box', capacity: '800 cu ft', price: '$169/day', suitable: false, gnomeAdvice: 'Need more powerful magic!' },
                { type: 'Large Enchanted Truck', size: '20ft box', capacity: '1200 cu ft', price: '$219/day', suitable: true, gnomeAdvice: 'Great for family magic!' },
                { type: 'Extra Large Magic Truck', size: '26ft box', capacity: '1600 cu ft', price: '$289/day', suitable: true, gnomeAdvice: 'Ultimate magical capacity!' }
            ],
            '4bedroom': [
                { type: 'Large Enchanted Truck', size: '20ft box', capacity: '1200 cu ft', price: '$219/day', suitable: false, gnomeAdvice: 'Need stronger spells!' },
                { type: 'Mega Magic Truck', size: '26ft box', capacity: '1600 cu ft', price: '$289/day', suitable: true, gnomeAdvice: 'Built for big family magic!' },
                { type: 'Legendary Semi + Trailer', size: '53ft trailer', capacity: '3000 cu ft', price: '$399/day', suitable: true, gnomeAdvice: 'The ultimate moving magic!' }
            ]
        };

        const options = truckOptions[homeSize] || truckOptions['2bedroom'];
        
        return `
            <div class="truck-grid">
                ${options.map(truck => `
                    <div class="truck-option ${truck.suitable ? 'recommended' : 'not-recommended'}">
                        <div class="truck-header">
                            <h6>🚛 ${truck.type} ${truck.suitable ? '⭐ RECOMMENDED' : ''}</h6>
                            <span class="truck-price">${truck.price}</span>
                        </div>
                        <div class="truck-details">
                            <p><strong>Size:</strong> ${truck.size}</p>
                            <p><strong>Capacity:</strong> ${truck.capacity}</p>
                            <div class="gnome-truck-advice">
                                <span class="gnome-icon">🧙‍♂️</span>
                                <span class="advice-text">"${truck.gnomeAdvice}"</span>
                            </div>
                            <p class="suitability ${truck.suitable ? 'suitable' : 'not-suitable'}">
                                ${truck.suitable ? '✅ Gnome Approved!' : '⚠️ Gnome says: might be challenging'}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    initMap() {
        // Center map on continental United States
        this.map = L.map('map').setView([39.8283, -98.5795], 4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add US-focused styling
        this.map.setMaxBounds([
            [20, -130], // Southwest corner
            [50, -65]   // Northeast corner
        ]);
    }

    async getZipCoordinates(zip) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&postalcode=${zip}&limit=1`, {
                headers: {
                    'User-Agent': 'HolyMove/1.0'
                }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }
            return null;
        } catch (error) {
            console.error('Error geocoding ZIP:', error);
            return null;
        }
    }

    async showRoute(geometry, fromLocation, toLocation) {
        // Clear existing routes and markers
        this.map.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker || layer instanceof L.CircleMarker) {
                this.map.removeLayer(layer);
            }
        });

        if (geometry && geometry.coordinates && geometry.coordinates.length > 0) {
            // Convert coordinates from [lon, lat] to [lat, lon] for Leaflet
            const coordinates = geometry.coordinates.map(coord => [coord[1], coord[0]]);
            
            // Create the main route line with beautiful styling
            const routeLine = L.polyline(coordinates, { 
                color: '#667eea', 
                weight: 6,
                opacity: 0.8,
                dashArray: '10, 5',
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(this.map);

            // Add a shadow/outline effect
            const routeShadow = L.polyline(coordinates, {
                color: '#1e40af',
                weight: 8,
                opacity: 0.3
            }).addTo(this.map);

            // Add waypoint markers along the route (every 10th point for performance)
            const waypointInterval = Math.max(1, Math.floor(coordinates.length / 20));
            coordinates.forEach((coord, index) => {
                if (index % waypointInterval === 0 && index > 0 && index < coordinates.length - 1) {
                    L.circleMarker(coord, {
                        radius: 4,
                        fillColor: '#f97316',
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(this.map).bindTooltip(`Waypoint ${Math.floor(index / waypointInterval)}`, {
                        direction: 'top',
                        offset: [0, -10]
                    });
                }
            });
            
            // Create custom icons for start and end points
            const startIcon = L.divIcon({
                html: `<div class="route-marker start-marker">
                    <div class="marker-icon">🏠</div>
                    <div class="marker-pulse"></div>
                </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 35],
                className: 'custom-route-marker'
            });
            
            const endIcon = L.divIcon({
                html: `<div class="route-marker end-marker">
                    <div class="marker-icon">�</div>
                    <div class="marker-pulse"></div>
                </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 35],
                className: 'custom-route-marker'
            });

            // Add start and end markers
            const startMarker = L.marker(coordinates[0], {icon: startIcon})
                .addTo(this.map)
                .bindPopup(`
                    <div class="route-popup">
                        <h4>🏠 Starting Point</h4>
                        <p><strong>${fromLocation}</strong></p>
                        <p>📍 ${coordinates[0][0].toFixed(4)}, ${coordinates[0][1].toFixed(4)}</p>
                    </div>
                `, { maxWidth: 250 });
                    
            const endMarker = L.marker(coordinates[coordinates.length - 1], {icon: endIcon})
                .addTo(this.map)
                .bindPopup(`
                    <div class="route-popup">
                        <h4>🎯 Destination</h4>
                        <p><strong>${toLocation}</strong></p>
                        <p>📍 ${coordinates[coordinates.length - 1][0].toFixed(4)}, ${coordinates[coordinates.length - 1][1].toFixed(4)}</p>
                    </div>
                `, { maxWidth: 250 });

            // Calculate route statistics
            const distance = this.calculateRouteDistance(coordinates);
            const bounds = routeLine.getBounds();
            
            // Add route info control
            const routeInfo = L.control({position: 'bottomright'});
            routeInfo.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'route-info-control');
                div.innerHTML = `
                    <div class="route-stats">
                        <h5>📊 Route Statistics</h5>
                        <p><strong>Total Points:</strong> ${coordinates.length}</p>
                        <p><strong>Calculated Distance:</strong> ${distance.toFixed(1)} miles</p>
                        <p><strong>Route Complexity:</strong> ${coordinates.length > 100 ? 'Detailed' : 'Simple'}</p>
                    </div>
                `;
                return div;
            };
            routeInfo.addTo(this.map);
            
            // Fit map to route with nice padding
            this.map.fitBounds(bounds, { 
                padding: [50, 50],
                maxZoom: 12 
            });

            // Auto-open start marker popup
            setTimeout(() => {
                startMarker.openPopup();
            }, 500);

            // Add route animation effect
            this.animateRoute(routeLine);

        } else {
            // Fallback: try to show locations using ZIP codes if no route geometry
            console.log('No route geometry provided, falling back to ZIP code lookup');
            await this.showZipCodeLocations(fromLocation, toLocation);
        }
    }

    calculateRouteDistance(coordinates) {
        let totalDistance = 0;
        for (let i = 1; i < coordinates.length; i++) {
            const lat1 = coordinates[i-1][0];
            const lon1 = coordinates[i-1][1];
            const lat2 = coordinates[i][0];
            const lon2 = coordinates[i][1];
            
            // Haversine formula for distance calculation
            const R = 3959; // Earth's radius in miles
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            totalDistance += R * c;
        }
        return totalDistance;
    }

    animateRoute(routeLine) {
        // Add a subtle animation effect to the route
        let opacity = 0.8;
        let increasing = false;
        
        const animate = () => {
            if (increasing) {
                opacity += 0.02;
                if (opacity >= 1) increasing = false;
            } else {
                opacity -= 0.02;
                if (opacity <= 0.6) increasing = true;
            }
            
            if (routeLine._map) {
                routeLine.setStyle({ opacity: opacity });
                requestAnimationFrame(animate);
            }
        };
        
        setTimeout(() => {
            animate();
        }, 1000);
    }

    async showZipCodeLocations(fromLocation, toLocation) {
        // Fallback method when no route geometry is available
        const fromZip = fromLocation.match(/\d{5}/)?.[0];
        const toZip = toLocation.match(/\d{5}/)?.[0];
        
        if (fromZip && toZip) {
            const [fromCoords, toCoords] = await Promise.all([
                this.getZipCoordinates(fromZip),
                this.getZipCoordinates(toZip)
            ]);
            
            if (fromCoords && toCoords) {
                const startIcon = L.divIcon({
                    html: `<div class="route-marker start-marker">
                        <div class="marker-icon">🏠</div>
                    </div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 35],
                    className: 'custom-route-marker'
                });
                
                const endIcon = L.divIcon({
                    html: `<div class="route-marker end-marker">
                        <div class="marker-icon">�</div>
                    </div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 35],
                    className: 'custom-route-marker'
                });

                L.marker(fromCoords, {icon: startIcon})
                    .addTo(this.map)
                    .bindPopup(`<strong>Origin:</strong><br>${fromLocation}`)
                    .openPopup();
                    
                L.marker(toCoords, {icon: endIcon})
                    .addTo(this.map)
                    .bindPopup(`<strong>Destination:</strong><br>${toLocation}`);
                
                // Draw dashed line between points
                L.polyline([fromCoords, toCoords], {
                    color: '#667eea',
                    weight: 4,
                    opacity: 0.7,
                    dashArray: '15, 10'
                }).addTo(this.map);
                
                // Fit map to show both locations
                const group = new L.featureGroup([
                    L.marker(fromCoords),
                    L.marker(toCoords)
                ]);
                this.map.fitBounds(group.getBounds().pad(0.1));
            }
        }
    }

    calculateStraightLineDistance(coord1, coord2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
        const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    showFallbackMap() {
        // Show centered US map when we can't get specific locations
        this.map.setView([39.8283, -98.5795], 4);
        
        const info = L.control({position: 'bottomright'});
        info.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'route-info-control');
            div.innerHTML = `
                <div class="route-stats">
                    <h5>⚠️ Map Info</h5>
                    <p>Could not locate specific addresses</p>
                    <p>Please verify ZIP codes are correct</p>
                    <p><em>Open browser console (F12) for debug info</em></p>
                </div>
            `;
            return div;
        };
        info.addTo(this.map);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HolyMoveApp();
});
