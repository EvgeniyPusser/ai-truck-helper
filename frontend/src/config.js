//export const API_BASE = import.meta.env.VITE_API_URL || '';
// frontend/src/config.js
//export const API_BASE = "https://api.hollymove.com";
// export const API_BASE = "https://ai-truck-helper.onrender.com";



// export const api = (path) => `${API_BASE}${path}`;

// // Готово: теперь «Result view» будет с реальными данными с бэка.
// export const API_LOGIN = api("/api/auth/login");

// export const API_CHAT = api("/api/chat");

// src/config.js
export const API_BASE = import.meta.env.VITE_API_URL || "";

export const api = (path) => `${API_BASE}${path}`;

export const API_LOGIN = api("/api/auth/login");
export const API_CHAT  = api("/api/chat");

