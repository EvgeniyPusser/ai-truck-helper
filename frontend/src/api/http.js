const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok)
    throw new Error(`${options.method || "GET"} ${path} failed: ${res.status}`);
  return res.json();
}
