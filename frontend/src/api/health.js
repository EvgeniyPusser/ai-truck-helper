import { apiFetch } from "./http";

export function health() {
  return apiFetch("/health");
}
