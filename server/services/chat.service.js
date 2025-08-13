import { geocode } from "./geocode.ts";
import { getRoute } from "./route.js";

/** Главный планировщик */
export async function buildPlan({ from, to, date, volume, needHelpers }) {
  if (!from || !to) throw new Error("from and to are required");

  const origin = await geocode(from);
  const dest = await geocode(to);
  if (origin[0] === dest[0] && origin[1] === dest[1]) {
    throw new Error("Origin and destination geocode to the same point; try more specific addresses.");
  }

  const route = await getRoute(origin, dest);
  const km = +(route.distance / 1000).toFixed(4);
  const miles = +(km * 0.621371).toFixed(1);
  const driveH = +(route.duration / 3600).toFixed(1);

  // простая оценка ресурсов/цен
  const helpers = needHelpers ? 2 : 0;
  const transport = Math.round(1.1 * miles + 90);
  const labor = helpers * 14 * 4;
  const platformFee = 39;
  const estTotal = transport + labor + platformFee;

  return {
    itinerary: {
      from, to, date,
      hours: 2, // совместимость со старым фронтом
      km, miles, drive_time_h: driveH,
      geometry: route.geometry,
    },
    resources: {
      estimated_volume_m3: volume ?? null,
      helpers,
    },
    pricing: { transport, labor, platformFee, estTotal },
    narrative: null,
  };
}
