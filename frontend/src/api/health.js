const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "https://holymove-api.onrender.com"
    : "http://localhost:3001");

export async function health() {
  const res = await fetch(`${API_URL}/api/health`);
  return res.json();
}
