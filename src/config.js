import dotenv from "dotenv";
dotenv.config();

export const config = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: "https://openrouter.ai/api/v1/chat/completions", // можно заменить позже
  model: "openrouter/openai/gpt-3.5-turbo", // или другой, если хочешь
};
