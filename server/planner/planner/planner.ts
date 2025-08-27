// import fs from "fs";
// import path from "path";

// // Read JSON data from files


// const dataDir = path.resolve(__dirname, "../../data");

// const clients = JSON.parse(
//   fs.readFileSync(path.join(dataDir, "clients.json"), "utf-8")
// );

// const trucks = JSON.parse(
//   fs.readFileSync(path.join(dataDir, "trucks.json"), "utf-8")
// );

// const helpers = JSON.parse(
//   fs.readFileSync(path.join(dataDir, "helpers.json"), "utf-8")
// );



  
// // Simple distance estimator placeholder (replace with real API later)
// function estimateDistance(from: string, to: string): number {
//   // For now, hardcoded example or simple logic:
//   if (from === "Los Angeles, CA" && to === "Phoenix, AZ") return 600;
//   if (from === "Los Angeles, CA" && to === "San Diego, CA") return 130;
//   return 100; // default
// }

// // Calculate price function
// function calculatePrice(
//   distance: number,
//   truck: any,
//   volume: number,
//   helpersCount: number
// ) {
//   const truckCost = truck.pricePerMile * distance;
//   const helperCost = helpersCount * 25 * 4; // assuming 4 hours per helper
//   return truckCost + helperCost;
// }

// // Select the best plan for one client request
// function selectPlan(clientRequest: any) {
//   const { from, to, volume, needHelpers, date } = clientRequest;
//   const distance = estimateDistance(from, to);

//   // Filter trucks by location, date, and size
//   const availableTrucks = trucks.filter(
//     (t: any) =>
//       t.location === from &&
//       t.availableDates.includes(date) &&
//       t.size >= volume &&
//       t.clean === true
//   );

//   if (availableTrucks.length === 0) {
//     console.log("No suitable trucks available.");
//     return null;
//   }

//   // Pick truck with best rating and lowest price per mile
//   availableTrucks.sort(
//     (a: any, b: any) =>
//       b.rating - a.rating || a.pricePerMile - b.pricePerMile
//   );

//   const chosenTruck = availableTrucks[0];

//   // Helpers selection
//   let helpersSelected: any[] = [];
//   if (needHelpers) {
//     // Filter helpers by location and availability
//     const availableHelpers = helpers.filter(
//       (h: any) => h.location === from && h.availableDates.includes(date)
//     );

//     // Choose helpers with best rating, max 2 helpers
//     availableHelpers.sort((a: any, b: any) => b.rating - a.rating);
//     helpersSelected = availableHelpers.slice(0, 2);
//   }

//   // Calculate total price
//   const totalPrice = calculatePrice(
//     distance,
//     chosenTruck,
//     volume,
//     helpersSelected.length
//   );

//   // Return plan summary
//   return {
//     clientRequest,
//     chosenTruck,
//     helpersSelected,
//     distance,
//     totalPrice,
//   };
// }

// // Run selection for all clients
// clients.forEach((client: any) => {
//   const plan = selectPlan(client);
//   console.log("Plan for client:", client.id);
//   console.log(plan);
// });


import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const {
  OPENROUTESERVICE_API_KEY,
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
  OPENROUTER_BASE_URL,
  JWT_SECRET,
  VITE_API_URL,
  NGROK_DOMAIN,
} = process.env;

const dataDir = path.resolve(__dirname, "../../data");

const clients = JSON.parse(
  fs.readFileSync(path.join(dataDir, "clients.json"), "utf-8")
);

const trucks = JSON.parse(
  fs.readFileSync(path.join(dataDir, "trucks.json"), "utf-8")
);

const helpers = JSON.parse(
  fs.readFileSync(path.join(dataDir, "helpers.json"), "utf-8")
);

// --- Реальный расчет маршрута через OpenRouteService ---
async function estimateDistance(from: string, to: string): Promise<number> {
  if (!OPENROUTESERVICE_API_KEY)
    throw new Error("OPENROUTESERVICE_API_KEY not set in .env");

  // Геокодирование через Nominatim
  async function geocode(address: string): Promise<[number, number]> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "HolyMove/1.0 (planner)",
        Accept: "application/json",
      },
    });
    const data = await r.json();
    if (!Array.isArray(data) || !data[0]?.lon || !data[0]?.lat) {
      throw new Error("Geocode failed for: " + address);
    }
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  }

  const [fromLon, fromLat] = await geocode(from);
  const [toLon, toLat] = await geocode(to);

  // Запрос к OpenRouteService
  const orsUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTESERVICE_API_KEY}`;
  const body = {
    coordinates: [
      [fromLon, fromLat],
      [toLon, toLat],
    ],
  };
  const res = await fetch(orsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ORS error: ${res.status} ${errText}`);
  }
  //   const data = await res.json();
  //   const distance = data?.routes?.[0]?.summary?.distance;
  //   if (!distance) throw new Error("No distance in ORS response");
  //   return Math.round(distance / 1000); // км
  // }
  
  // ...existing code...

  const data: any = await res.json(); // <--- добавьте : any

  const distance = data?.routes?.[0]?.summary?.distance;
  if (!distance) throw new Error("No distance in ORS response");
  return Math.round(distance / 1000); // км

  // ...existing code...

  // --- Пример запроса к AI через OpenRouter ---
  async function askAI(prompt: string): Promise<string> {
    if (!OPENROUTER_API_KEY || !OPENROUTER_MODEL || !OPENROUTER_BASE_URL)
      throw new Error("AI keys not set in .env");

    const res = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AI error: ${res.status} ${errText}`);
    }
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content || "";
  }

  function calculatePrice(
    distance: number,
    truck: any,
    volume: number,
    helpersCount: number
  ) {
    const truckCost = truck.pricePerMile ? truck.pricePerMile * distance : 0;
    const helperCost = helpersCount * 25 * 4; // assuming 4 hours per helper
    return truckCost + helperCost;
  }

  async function selectPlan(clientRequest: any) {
    const { from, to, volume, needHelpers, date } = clientRequest;
    let distance: number;
    try {
      distance = await estimateDistance(from, to);
    } catch (e) {
      console.error("Distance error:", e.message);
      return null;
    }

    // Фильтрация грузовиков и помощников — адаптируйте под ваши данные!
    const availableTrucks = trucks;
    const chosenTruck = availableTrucks[0];

    let helpersSelected: any[] = [];
    if (needHelpers) {
      helpersSelected = helpers.slice(0, 2);
    }

    const totalPrice = calculatePrice(
      distance,
      chosenTruck,
      volume,
      helpersSelected.length
    );

    // Пример запроса к AI (можно расширить промпт)
    const aiPrompt = `План переезда: из ${from} в ${to}, объем ${volume} м3, грузовик ${chosenTruck?.name}, помощников: ${helpersSelected.length}, расстояние: ${distance} км, цена: ${totalPrice}`;
    let aiAdvice = "";
    try {
      aiAdvice = await askAI(aiPrompt);
    } catch (e) {
      aiAdvice = "AI advice unavailable: " + e.message;
    }

    return {
      clientRequest,
      chosenTruck,
      helpersSelected,
      distance,
      totalPrice,
      aiAdvice,
    };
  }

  // Запуск для всех клиентов
  // ...existing code...

  // Запуск для всех клиентов
  (async () => {
    for (const client of clients) {
      const plan = await selectPlan(client);
      console.log("Plan for client:", client.id);
      console.log(plan);
    }
  })()
}