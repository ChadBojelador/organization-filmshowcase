import { apiFetch } from "./api";

const TOKEN_KEY = "token";
const DIRECTOR_KEY = "director";

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY) || "";
  const directorRaw = localStorage.getItem(DIRECTOR_KEY);

  let director = null;

  if (directorRaw) {
    try {
      director = JSON.parse(directorRaw);
    } catch {
      director = null;
    }
  }

  return { token, director };
}

export function setStoredAuth({ token, user }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(DIRECTOR_KEY, JSON.stringify(user));
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(DIRECTOR_KEY);
}

export async function fetchCurrentUser() {
  const { token } = getStoredAuth();

  if (!token) {
    return null;
  }

  const response = await apiFetch("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    clearStoredAuth();
    return null;
  }

  const data = await response.json();

  if (data?.user) {
    setStoredAuth({ token, user: data.user });
    return data.user;
  }

  return null;
}