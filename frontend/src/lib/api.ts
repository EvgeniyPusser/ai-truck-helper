// Use the global ImportMetaEnv type provided by Vite

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function apiJson(path: string, init?: RequestInit) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const ctype = res.headers.get('content-type') || '';
  const raw = await res.text(); // читаем ВСЕГДА как текст — не падаем на .json()

  if (!res.ok) {
    const preview = raw?.slice(0, 400) || '';
    throw new Error(`HTTP ${res.status} ${res.statusText} @ ${path}\n${preview}`);
  }

  if (!raw) return null; // 204 / пусто — ок

  if (ctype.includes('application/json')) {
    try { return JSON.parse(raw); }
    catch (e) { throw new Error(`Bad JSON from ${path}: ${String(e)}\n${raw.slice(0, 400)}`); }
  }

  // На всякий случай вернём сырой текст
  return { raw };
}
