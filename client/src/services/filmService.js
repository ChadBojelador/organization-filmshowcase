import { apiRequest } from "../lib/apiClient";

export async function fetchFilms() {
  const data = await apiRequest("/api/films");
  return Array.isArray(data?.films) ? data.films : Array.isArray(data) ? data : [];
}

export async function addFilm(payload) {
  return apiRequest("/api/addFilm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateFilm(filmId, payload) {
  return apiRequest(`/api/films/${filmId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteFilm(filmId) {
  return apiRequest(`/api/films/${filmId}`, {
    method: "DELETE",
  });
}
