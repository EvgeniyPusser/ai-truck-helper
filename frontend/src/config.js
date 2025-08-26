// // src/config.js

// export const API_BASE = "https://api.holymovela.com";
// // если нужно тестить напрямую через Render, можно временно:
// // export const API_BASE = "https://ai-truck-helper.onrender.com";

// const api = (path) => `${API_BASE}${path}`;

// export const API_LOGIN = api("/api/auth/login");
// export const API_CHAT = api("/api/chat");

export const API_BASE = "https://www.holymovela.com";
export const API_LOGIN = `${API_BASE}/api/auth/login`;
export const API_CHAT = `${API_BASE}/api/chat`;
