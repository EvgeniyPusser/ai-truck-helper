// frontend/src/config.js
const isLocal =
  typeof window !== "undefined" && window.location.hostname === "localhost";

// В dev (localhost:5173) — через Vite proxy → пустая база ('')
// В проде — Render API
export const API_BASE = isLocal ? "" : "https://ai-truck-helper.onrender.com";

export const api = (path) => `${API_BASE}${path}`;
export const API_LOGIN = api("/api/auth/login");
export const API_CHAT = api("/api/chat");
