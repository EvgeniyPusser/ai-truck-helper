const BASE = import.meta.env.VITE_API_URL;

export async function fetchMovePlan(formData) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error(`Chat API failed: ${res.status}`);
  return res.json();
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok)
    throw new Error(`${options.method || "GET"} ${path} failed: ${res.status}`);
  return res.json();
}
