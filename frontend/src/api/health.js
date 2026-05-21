import { API_URL } from "./config";

export async function health() {
  const res = await fetch(`${API_URL}/api/health`);
  return res.json();
}
