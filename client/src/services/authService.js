import { apiRequest } from "../lib/apiClient";

export async function signIn(payload) {
  return apiRequest("/api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signUp(payload) {
  return apiRequest("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
