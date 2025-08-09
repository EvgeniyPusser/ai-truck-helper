import { geocode } from "../../src/services/geocode.ts"; // tsx lets us import .ts
import { getRoute } from "../../src/services/route.js";
import fetch from "node-fetch";
import { config } from "../../src/config.js";

export async function buildPlan({ from, to, date, volume, needHelpers }) {
  // 1) geocode + route
  const origin = await geocode(from);
  const dest = await geocode(to);
  const route = await getRoute(origin, dest);

  // 2) local pricing (adjust numbers as you like)
  const km = route.distance / 1000;
  const hours = Math.max(1, Math.round(route.duration / 3600));
  const helpers = needHelpers ? 2 : 0;
  const basePerKm = 1.1;
  const helperPerHour = 28;

  const transport = Math.round(km * basePerKm);
  const labor = helpers * helperPerHour * hours;
  const subtotal = transport + labor;
  const platformFee = Math.round(subtotal * 0.12);
  const estTotal = subtotal + platformFee;

  // 3) optional AI narrative with OpenRouter (if key present)
  let narrative = null;
  if (config.openRouterApiKey) {
    const res = await fetch(config.openRouterBaseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.openRouterModel,
        messages: [
          { role: "system", content: "You are a concise logistics assistant." },
          {
            role: "user",
            content: `Plan a DIY move from ${from} to ${to} on ${
              date || "unspecified"
            }.
Distance: ${km.toFixed(1)} km (~${hours}h). Helpers: ${helpers}.
Prices (USD) — transport: ${transport}, labor: ${labor}, platform fee: ${platformFee}, total: ${estTotal}.
Return <= 120 words + 3 bullet tips.`,
          },
        ],
        temperature: 0.2,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      narrative = data?.choices?.[0]?.message?.content || null;
    }
  }

  return {
    itinerary: { from, to, date, hours, km, geometry: route.geometry },
    resources: { estimated_volume_m3: volume ?? null, helpers },
    pricing: { transport, labor, platformFee, estTotal },
    narrative,
  };
}
