import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getAdminHeaders() {
  const adminToken = localStorage.getItem("adminToken") || "";

  if (!adminToken) {
    return {};
  }

  return {
    "x-admin-token": adminToken,
  };
}

function AdminModeration() {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionById, setActionById] = useState({});

  const pendingCount = useMemo(() => films.length, [films]);

  const fetchPendingFilms = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/films/pending`, {
        headers: {
          ...getAdminHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load pending films.");
      }

      const data = await response.json();
      setFilms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load pending films.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingFilms();
  }, []);

  const moderateFilm = async (filmId, action) => {
    setActionById((prev) => ({ ...prev, [filmId]: action }));
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/films/${filmId}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} film.`);
      }

      setFilms((prev) => prev.filter((film) => film._id !== filmId));
    } catch (err) {
      setError(err.message || `Failed to ${action} film.`);
    } finally {
      setActionById((prev) => ({ ...prev, [filmId]: "" }));
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-6 sm:py-8">
      <header className="mx-auto mb-4 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Admin Moderation Panel
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Pending films: <span className="font-semibold text-slate-800">{pendingCount}</span>
        </p>
      </header>

      <section className="mx-auto w-full max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-lg bg-white p-4 text-sm text-slate-600 shadow">
            Loading pending films...
          </div>
        ) : null}

        {!isLoading && films.length === 0 ? (
          <div className="rounded-lg bg-white p-4 text-sm text-slate-600 shadow">
            No pending films to moderate.
          </div>
        ) : null}

        {films.map((film) => {
          const currentAction = actionById[film._id];
          const title = film.filmTitle || film.title;

          return (
            <article key={film._id} className="rounded-xl bg-white p-4 shadow-md">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-600">
                  Team: <span className="font-medium text-slate-800">{film.teamName}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moderateFilm(film._id, "approve")}
                  disabled={Boolean(currentAction)}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {currentAction === "approve" ? "Approving..." : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={() => moderateFilm(film._id, "reject")}
                  disabled={Boolean(currentAction)}
                  className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {currentAction === "reject" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default AdminModeration;
