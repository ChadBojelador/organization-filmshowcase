import { apiRequest } from "../lib/apiClient";

export async function loginDirector(payload) {
  return apiRequest("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerDirector(payload) {
  return apiRequest("/api/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
