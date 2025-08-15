// frontend/src/utils/api.js
export async function apiFetch(path, options = {}) {
  const t =
    typeof window !== "undefined" ? localStorage.getItem("holly_token") : "";
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (t) headers.Authorization = `Bearer ${t}`;
  return fetch(path, { ...options, headers });
}
