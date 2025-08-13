// Тест API и маршрутизации
const testAPI = async () => {
    console.log('🧙‍♂️ Testing HolyMove API...');
    
    try {
        // Тест health endpoint
        const healthResponse = await fetch('http://localhost:3001/health');
        console.log('Health check:', healthResponse.ok ? '✅ OK' : '❌ Failed');
        
        // Тест логина
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'client1@test.com',
                password: 'password123'
            })
        });
        
        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('Login test: ✅ OK');
            console.log('User role:', loginData.user?.role);
            
            // Тест маршрута с токеном
            const routeResponse = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                },
                body: JSON.stringify({
                    from: '10001',
                    to: '11201',
                    date: '2025-08-15',
                    volume: 25,
                    needHelpers: true
                })
            });
            
            if (routeResponse.ok) {
                const routeData = await routeResponse.json();
                console.log('Route test: ✅ OK');
                console.log('Route distance:', routeData.itinerary?.miles, 'miles');
                console.log('Geometry points:', routeData.itinerary?.geometry?.coordinates?.length || 0);
            } else {
                console.log('Route test: ❌ Failed', routeResponse.status);
            }
            
        } else {
            console.log('Login test: ❌ Failed', loginResponse.status);
        }
        
    } catch (error) {
        console.error('Test error:', error.message);
    }
};

// Запуск теста
testAPI();
