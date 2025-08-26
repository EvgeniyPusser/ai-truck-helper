// // // src/config.js

// // export const API_BASE = "https://api.holymovela.com";
// // // если нужно тестить напрямую через Render, можно временно:
//  export const API_BASE = "https://ai-truck-helper.onrender.com";

// // const api = (path) => `${API_BASE}${path}`;

// // export const API_LOGIN = api("/api/auth/login");
// // export const API_CHAT = api("/api/chat");

// //export const API_BASE = "https://www.holymovela.com";
// export const API_LOGIN = `${API_BASE}/api/auth/login`;
// export const API_CHAT = `${API_BASE}/api/chat`;

// frontend/src/config.ts
// const BASE = (import.meta.env?.VITE_API_URL || "").trim();

// // Строгая проверка (чтобы в проде не осталось localhost)
// if (!BASE) {
//   throw new Error("VITE_API_URL is not set");
// }
// if (/localhost|127\.0\.0\.1/.test(BASE)) {
//   console.warn(
//     "[WARN] VITE_API_URL points to localhost — OK for dev, NOT for production."
//   );
// }

// export const api = (path) => `${BASE}${path}`;

// export const API_CHAT = api("/api/chat");
// export const API_LOGIN = api("/api/auth/login");

// frontend/src/config.js
export const BASE = (import.meta.env?.VITE_API_URL || "").trim();
if (!BASE) console.warn("[WARN] VITE_API_URL is empty");

export const api = (path) => `${BASE}${path}`;

export const API_LOGIN = api("/api/auth/login");
export const API_CHAT = api("/api/chat");
