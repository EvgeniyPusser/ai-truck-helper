// server/config.js

export const config = {
  // MAPS (OpenRouteService)
  orsApiKey: process.env.OPENROUTESERVICE_API_KEY || "",

  // AI (OpenRouter)
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterModel:
    process.env.OPENROUTER_MODEL || "openrouter/anthropic/claude-3.5-sonnet",
  openRouterBaseUrl:
    process.env.OPENROUTER_BASE_URL ||
    "https://openrouter.ai/api/v1/chat/completions",

  // Back-compat so existing imports don't break:
  apiKey: process.env.OPENROUTESERVICE_API_KEY || "", // used by geocode.ts & route.js
  baseUrl:
    process.env.OPENROUTER_BASE_URL ||
    "https://openrouter.ai/api/v1/chat/completions",
  model:
    process.env.OPENROUTER_MODEL || "openrouter/anthropic/claude-3.5-sonnet",
};
