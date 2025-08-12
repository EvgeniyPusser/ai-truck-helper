import fs from "fs";
import path from "path";

// Read JSON data from files


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



  
// Simple distance estimator placeholder (replace with real API later)
function estimateDistance(from: string, to: string): number {
  // For now, hardcoded example or simple logic:
  if (from === "Los Angeles, CA" && to === "Phoenix, AZ") return 600;
  if (from === "Los Angeles, CA" && to === "San Diego, CA") return 130;
  return 100; // default
}

// Calculate price function
function calculatePrice(
  distance: number,
  truck: any,
  volume: number,
  helpersCount: number
) {
  const truckCost = truck.pricePerMile * distance;
  const helperCost = helpersCount * 25 * 4; // assuming 4 hours per helper
  return truckCost + helperCost;
}

// Select the best plan for one client request
function selectPlan(clientRequest: any) {
  const { from, to, volume, needHelpers, date } = clientRequest;
  const distance = estimateDistance(from, to);

  // Filter trucks by location, date, and size
  const availableTrucks = trucks.filter(
    (t: any) =>
      t.location === from &&
      t.availableDates.includes(date) &&
      t.size >= volume &&
      t.clean === true
  );

  if (availableTrucks.length === 0) {
    console.log("No suitable trucks available.");
    return null;
  }

  // Pick truck with best rating and lowest price per mile
  availableTrucks.sort(
    (a: any, b: any) =>
      b.rating - a.rating || a.pricePerMile - b.pricePerMile
  );

  const chosenTruck = availableTrucks[0];

  // Helpers selection
  let helpersSelected: any[] = [];
  if (needHelpers) {
    // Filter helpers by location and availability
    const availableHelpers = helpers.filter(
      (h: any) => h.location === from && h.availableDates.includes(date)
    );

    // Choose helpers with best rating, max 2 helpers
    availableHelpers.sort((a: any, b: any) => b.rating - a.rating);
    helpersSelected = availableHelpers.slice(0, 2);
  }

  // Calculate total price
  const totalPrice = calculatePrice(
    distance,
    chosenTruck,
    volume,
    helpersSelected.length
  );

  // Return plan summary
  return {
    clientRequest,
    chosenTruck,
    helpersSelected,
    distance,
    totalPrice,
  };
}

// Run selection for all clients
clients.forEach((client: any) => {
  const plan = selectPlan(client);
  console.log("Plan for client:", client.id);
  console.log(plan);
});
