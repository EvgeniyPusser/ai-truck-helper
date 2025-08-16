export const API_BASE = import.meta.env.VITE_API_URL || '';
export const api = (path) => `${API_BASE}${path}`;

// Готово: теперь «Result view» будет с реальными данными с бэка.
export const API_LOGIN = api('/api/auth/login');


export const API_CHAT = api('/api/chat');