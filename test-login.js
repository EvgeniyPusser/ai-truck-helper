// Quick test script for login API
const testLogin = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'client@example.com',
                password: 'client123'
            })
        });
        
        console.log('Status:', response.status);
        console.log('OK:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Success:', data);
        } else {
            const error = await response.text();
            console.log('Error:', error);
        }
    } catch (err) {
        console.log('Network error:', err.message);
    }
};

testLogin();
