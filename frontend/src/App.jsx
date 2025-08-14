import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: '#2B6CB0', fontSize: '32px', margin: '0' }}>🏠 Holly Move</h1>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '16px', color: '#1A202C' }}>Your Moving Journey Starts Here</h2>
          <p style={{ fontSize: '20px', color: '#718096', marginBottom: '32px' }}>From ZIP to ZIP, we'll help you find the perfect moving solution</p>
          
          <div style={{ backgroundColor: '#EDF2F7', padding: '32px', borderRadius: '12px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Plan Your Move</h3>
            <p style={{ color: '#718096', marginBottom: '20px' }}>ZIP form will be here...</p>
            <button style={{ 
              backgroundColor: '#3182CE', 
              color: 'white', 
              padding: '12px 32px', 
              borderRadius: '8px', 
              border: 'none', 
              fontSize: '18px',
              cursor: 'pointer',
              width: '100%'
            }}>
              Find Moving Options
            </button>
          </div>
          
          <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Are you a service provider?</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button style={{ padding: '12px 24px', borderRadius: '8px', border: '2px solid #38A169', color: '#38A169', backgroundColor: 'white', cursor: 'pointer' }}>🤝 Helper</button>
            <button style={{ padding: '12px 24px', borderRadius: '8px', border: '2px solid #E53E3E', color: '#E53E3E', backgroundColor: 'white', cursor: 'pointer' }}>🚛 Truck Owner</button>
            <button style={{ padding: '12px 24px', borderRadius: '8px', border: '2px solid #3182CE', color: '#3182CE', backgroundColor: 'white', cursor: 'pointer' }}>🏢 Moving Company</button>
            <button style={{ padding: '12px 24px', borderRadius: '8px', border: '2px solid #718096', color: '#718096', backgroundColor: 'white', cursor: 'pointer' }}>👔 Real Estate Agent</button>
          </div>
        </div>
      </div>
    </ChakraProvider>
  )
}

export default App
