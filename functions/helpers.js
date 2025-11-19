exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { pickupZip, dropoffZip, helpers, volume, rooms, date } = body;
      
      console.log('Request data:', { pickupZip, dropoffZip, helpers, volume, rooms, date });
      
      // Simple validation
      if (!pickupZip || !dropoffZip || !date) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'pickupZip, dropoffZip and date are required' }),
        };
      }

      // Mock response with realistic data
      const mockResult = [
        {
          id: "provider1",
          name: "QuickMove Solutions",
          rating: 4.8,
          reviews: 342,
          price: 1250,
          originalPrice: 1450,
          savings: 200,
          phone: "+1-555-MOVE-123",
          distance: Math.abs(parseInt(pickupZip) - parseInt(dropoffZip)) * 10 + 150,
          estimatedTime: "4-6 hours",
          truckType: "26ft Moving Truck",
          helpers: helpers || rooms || 2,
          includesMovingEquipment: true,
          services: ["Loading", "Transportation", "Unloading", "Basic packing"],
          availability: "Available",
          specialOffers: ["First-time customer discount", "Weekend availability"]
        },
        {
          id: "provider2", 
          name: "Professional Movers Co",
          rating: 4.6,
          reviews: 198,
          price: 1380,
          originalPrice: 1580,
          savings: 200,
          phone: "+1-555-PRO-MOVE",
          distance: Math.abs(parseInt(pickupZip) - parseInt(dropoffZip)) * 10 + 150,
          estimatedTime: "5-7 hours",
          truckType: "24ft Moving Truck",
          helpers: helpers || rooms || 2,
          includesMovingEquipment: true,
          services: ["Loading", "Transportation", "Unloading", "Furniture wrapping"],
          availability: "Available",
          specialOffers: ["Insurance included", "Free boxes"]
        },
        {
          id: "provider3",
          name: "Budget Move Express",
          rating: 4.3,
          reviews: 156,
          price: 950,
          originalPrice: 1150,
          savings: 200,
          phone: "+1-555-BUDGET-1",
          distance: Math.abs(parseInt(pickupZip) - parseInt(dropoffZip)) * 10 + 150,
          estimatedTime: "6-8 hours",
          truckType: "20ft Moving Truck",
          helpers: helpers || rooms || 2,
          includesMovingEquipment: false,
          services: ["Loading", "Transportation", "Unloading"],
          availability: "Limited availability",
          specialOffers: ["Lowest price guarantee"]
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockResult),
      };
    } catch (error) {
      console.error('Error in helpers function:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Internal server error' }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};