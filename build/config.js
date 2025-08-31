import dotenv from "dotenv";
dotenv.config();
export const config = {
    orsApiKey: process.env.OPENROUTESERVICE_API_KEY || "",
    openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
    openRouterModel: process.env.OPENROUTER_MODEL || "openrouter/anthropic/claude-3.5-sonnet",
    openRouterBaseUrl: process.env.OPENROUTER_BASE_URL ||
        "https://openrouter.ai/api/v1/chat/completions",
    apiKey: process.env.OPENROUTESERVICE_API_KEY || "",
    baseUrl: process.env.OPENROUTER_BASE_URL ||
        "https://openrouter.ai/api/v1/chat/completions",
    model: process.env.OPENROUTER_MODEL || "openrouter/anthropic/claude-3.5-sonnet",
};
