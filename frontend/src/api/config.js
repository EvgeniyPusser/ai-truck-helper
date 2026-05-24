function getLocalApiUrl() {
  if (typeof window === "undefined") return "http://localhost:3001";
  const { hostname } = window.location;
  if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
    return `http://${hostname}:3001`;
  }
  return import.meta.env.VITE_API_URL || "http://localhost:3001";
}

export const API_URL = import.meta.env.MODE === "production" ? "" : getLocalApiUrl();
