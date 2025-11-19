// Import the same logic from server
const findHelpers = async (params) => {
  const { pickupZip, dropoffZip, helpers, volume, rooms, date } = params;

  // Mock trucks data for Netlify
  const trucks = [
    {
      id: "van",
      name: "Cargo Van",
      volume_m3: 10,
      max_weight_kg: 1000,
      description: "Perfect for small moves",
    },
    {
      id: "small_box",
      name: "14ft Box Truck",
      volume_m3: 25,
      max_weight_kg: 2000,
      description: "Ideal for 1-2 bedroom apartments",
    },
    {
      id: "large_box",
      name: "26ft Box Truck",
      volume_m3: 50,
      max_weight_kg: 4000,
      description: "Best for large homes and offices",
    },
  ];

  // Calculate distance and time (simplified)
  const distance =
    Math.abs(parseInt(pickupZip) - parseInt(dropoffZip)) * 0.1 +
    Math.random() * 100 +
    50;
  const estimatedTime = Math.round((rooms * 2 + distance / 45) * 10) / 10;

  // Base pricing
  const baseHourlyRate = 35;
  const helperCount = helpers || 2;
  const baseLaborCost = Math.round(
    baseHourlyRate * helperCount * estimatedTime
  );
  const truck =
    trucks.find((t) => (volume || rooms * 15) <= t.volume_m3) || trucks[1];

  // Generate 3 helpers with different prices
  return [
    {
      id: "h1",
      name: "Michael Rodriguez",
      rating: 4.8,
      experience: "5 years",
      specialties: ["Furniture Assembly", "Fragile Items", "Piano Moving"],
      rate: baseLaborCost + 200,
      hourlyRate: baseHourlyRate,
      source: "TopMovers Pro",
      pickupZip,
      dropoffZip,
      distance: Math.round(distance),
      estimatedTime,
      helperCount,
      truck: {
        id: truck.id,
        name: truck.name,
        volume_m3: truck.volume_m3,
        max_weight_kg: truck.max_weight_kg,
        description: truck.description,
        dailyRate: 50,
        mileageRate: 1.29,
      },
      services: {
        packing: true,
        unpacking: true,
        furniture_assembly: true,
        storage: false,
      },
      availability: "Available",
      phone: "(555) 123-4567",
    },
    {
      id: "h2",
      name: "Sarah Chen",
      rating: 4.9,
      experience: "7 years",
      specialties: ["Apartment Moves", "Office Relocation", "Senior Moving"],
      rate: Math.round((baseLaborCost + 200) * 0.95),
      hourlyRate: Math.round(baseHourlyRate * 0.95),
      source: "Elite Movers",
      pickupZip,
      dropoffZip,
      distance: Math.round(distance),
      estimatedTime,
      helperCount,
      truck: {
        id: truck.id,
        name: truck.name,
        volume_m3: truck.volume_m3,
        max_weight_kg: truck.max_weight_kg,
        description: truck.description,
        dailyRate: 50,
        mileageRate: 1.29,
      },
      services: {
        packing: true,
        unpacking: true,
        furniture_assembly: false,
        storage: true,
      },
      availability: "Available",
      phone: "(555) 987-6543",
    },
    {
      id: "h3",
      name: "David Thompson",
      rating: 4.6,
      experience: "3 years",
      specialties: ["Local Moves", "Student Housing", "Same Day Service"],
      rate: Math.round((baseLaborCost + 200) * 1.08),
      hourlyRate: Math.round(baseHourlyRate * 1.1),
      source: "QuickMove Express",
      pickupZip,
      dropoffZip,
      distance: Math.round(distance),
      estimatedTime: Math.round(estimatedTime * 0.9 * 10) / 10,
      helperCount,
      truck: {
        id: truck.id,
        name: truck.name,
        volume_m3: truck.volume_m3,
        max_weight_kg: truck.max_weight_kg,
        description: truck.description,
        dailyRate: 50,
        mileageRate: 1.29,
      },
      services: {
        packing: false,
        unpacking: false,
        furniture_assembly: true,
        storage: false,
      },
      availability: "Available Today",
      phone: "(555) 456-7890",
    },
  ];
};

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      const { pickupZip, dropoffZip, helpers, volume, rooms, date } = body;

      // Validation
      if (!pickupZip || !dropoffZip || !date) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "pickupZip, dropoffZip and date are required",
          }),
        };
      }

      const result = await findHelpers({
        pickupZip,
        dropoffZip,
        helpers: helpers || rooms || 2,
        volume,
        rooms: rooms || helpers || 1,
        date,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};
