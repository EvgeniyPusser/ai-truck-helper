// import express from 'express';

// const router = express.Router();

// // POST /api/search-movers
// router.post('/search-movers', async (req, res) => {
//   try {
//     const { fromZip, toZip, apartmentSize, moveDate, budget, truckSize } = req.body;

//     console.log('🔍 Search request:', req.body);

//     // Симуляция поиска перевозчиков
//     const mockResults = {
//       success: true,
//       searchParams: { fromZip, toZip, apartmentSize, moveDate, budget, truckSize },
//       results: [
//         {
//           id: 1,
//           name: "Holly's Moving Heroes",
//           type: "company",
//           rating: 4.8,
//           price: "$1,200-1,800",
//           truckSize: truckSize || "17ft",
//           available: true,
//           description: "AI-optimized moving with gnome magic! ✨"
//         },
//         {
//           id: 2,
//           name: "Speed Movers LA",
//           type: "truck",
//           rating: 4.5,
//           price: "$800-1,200",
//           truckSize: truckSize || "14ft",
//           available: true,
//           description: "Fast & reliable truck services 🚛"
//         },
//         {
//           id: 3,
//           name: "Helper Gnomes Inc",
//           type: "helper",
//           rating: 4.9,
//           price: "$300-500",
//           truckSize: "Customer provides",
//           available: true,
//           description: "Professional moving assistants 🤝"
//         }
//       ],
//       message: `Found ${3} movers from ${fromZip} to ${toZip}!`
//     };

//     // Небольшая задержка для имитации реального API
//     setTimeout(() => {
//       res.json(mockResults);
//     }, 1000);

//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to search movers',
//       message: error.message
//     });
//   }
// });

// // GET /api/test-connection
// router.get('/test-connection', (req, res) => {
//   res.json({
//     success: true,
//     message: '🎉 Frontend-Backend connection working!',
//     timestamp: new Date().toISOString(),
//     server: 'Holly Move API'
//   });
// });

// export default router;

import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const dataDir = path.resolve(__dirname, "../data");
const trucks = JSON.parse(
  fs.readFileSync(path.join(dataDir, "trucks.json"), "utf-8")
);
const helpers = JSON.parse(
  fs.readFileSync(path.join(dataDir, "helpers.json"), "utf-8")
);

router.post("/search-movers", async (req, res) => {
  try {
    const { fromZip, toZip, apartmentSize, moveDate, budget, truckSize } =
      req.body;

    // Реальный поиск грузовиков
    const foundTrucks = trucks
      .filter(
        (truck) =>
          truck.availableDates?.includes(moveDate) &&
          (!truckSize || truck.size >= parseInt(truckSize)) &&
          truck.location?.includes(fromZip)
      )
      .map((truck) => ({
        id: truck.id,
        name: truck.name,
        type: "truck",
        rating: truck.rating,
        price: `$${Math.round(
          truck.pricePerMile * 100 * (apartmentSize || truck.size)
        )}`,
        truckSize: truck.size + "m³",
        available: true,
        description: truck.description,
      }));

    // Реальный поиск помощников
    const foundHelpers = helpers
      .filter(
        (helper) =>
          helper.availableDates?.includes(moveDate) &&
          helper.location?.includes(fromZip)
      )
      .map((helper) => ({
        id: helper.id,
        name: helper.name,
        type: "helper",
        rating: helper.rating,
        price: `$${helper.pricePerHour * 4}`,
        truckSize: "Customer provides",
        available: true,
        description: helper.skills?.join(", "),
      }));

    const results = [...foundTrucks, ...foundHelpers];

    res.json({
      success: true,
      searchParams: {
        fromZip,
        toZip,
        apartmentSize,
        moveDate,
        budget,
        truckSize,
      },
      results,
      message: `Found ${results.length} movers from ${fromZip} to ${toZip}!`,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search movers",
      message: error.message,
    });
  }
});

router.get("/test-connection", (req, res) => {
  res.json({
    success: true,
    message: "🎉 Frontend-Backend connection working!",
    timestamp: new Date().toISOString(),
    server: "Holly Move API",
  });
});

export default router;
