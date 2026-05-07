// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  FilmIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import {
  fetchFilms,
  addFilm,
  deleteFilm,
  updateFilm,
} from "../services/filmService";

const emptyForm = {
  title: "",
  description: "",
  googleDriveUrl: "",
  thumbnailUrl: "",
  releaseDate: "",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [editingFilm, setEditingFilm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  // Safety-net auth guard — ProtectedRoute already handles this, but
  // this ensures a stale/empty localStorage can't reach the admin UI.
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    loadFilms();
  }, []);

  async function loadFilms() {
    setIsLoading(true);
    try {
      const list = await fetchFilms();
      setFilms(list);
    } catch {
      setFeedback({ type: "error", message: "Failed to load films." });
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEditing(film) {
    setEditingFilm(film);
    setForm({
      title: film.title || "",
      description: film.description || "",
      googleDriveUrl: film.videoEmbedUrl
        ? `https://drive.google.com/file/d/${film.fileId}/view`
        : "",
      thumbnailUrl: film.thumbnailUrl || "",
      releaseDate: film.releaseDate
        ? new Date(film.releaseDate).toISOString().slice(0, 10)
        : "",
    });
    setFeedback({ type: "", message: "" });
  }

  function cancelEditing() {
    setEditingFilm(null);
    setForm(emptyForm);
    setFeedback({ type: "", message: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      thumbnailUrl: form.thumbnailUrl.trim() || undefined,
      releaseDate: form.releaseDate || undefined,
    };

    try {
      if (editingFilm) {
        // Update
        if (form.googleDriveUrl.trim()) {
          payload.googleDriveUrl = form.googleDriveUrl.trim();
        }
        await updateFilm(editingFilm.id, payload);
        setFeedback({ type: "success", message: "Film updated successfully!" });
        setEditingFilm(null);
      } else {
        // Create
        payload.googleDriveUrl = form.googleDriveUrl.trim();
        if (!payload.googleDriveUrl) {
          setFeedback({
            type: "error",
            message: "Google Drive URL is required.",
          });
          setIsSubmitting(false);
          return;
        }
        await addFilm(payload);
        setFeedback({ type: "success", message: "Film added successfully!" });
      }

      setForm(emptyForm);
      await loadFilms();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(filmId) {
    if (!window.confirm("Are you sure you want to delete this film?")) return;
    setDeletingId(filmId);
    try {
      await deleteFilm(filmId);
      setFeedback({ type: "success", message: "Film deleted." });
      await loadFilms();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to delete film.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0a14] via-[#12101e] to-[#0d0b18] text-zinc-100">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-700/50 hover:text-white"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5">
                <FilmIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Admin Dashboard
              </h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">
          {/* ── Form Panel ── */}
          <div className="order-1">
            <div className="sticky top-20 rounded-2xl border border-zinc-700/40 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                  {editingFilm ? (
                    <>
                      <PencilSquareIcon className="h-5 w-5 text-amber-400" />
                      Edit Film
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 text-cyan-400" />
                      Add New Film
                    </>
                  )}
                </h2>
                {editingFilm && (
                  <button
                    onClick={cancelEditing}
                    className="rounded-md bg-zinc-800 p-1 text-zinc-400 transition hover:text-white"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {feedback.message && (
                <div
                  className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                    feedback.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Film Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter film title"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the film..."
                    className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Google Drive URL {editingFilm ? "(leave blank to keep)" : "*"}
                  </label>
                  <input
                    name="googleDriveUrl"
                    value={form.googleDriveUrl}
                    onChange={handleChange}
                    required={!editingFilm}
                    placeholder="https://drive.google.com/file/d/.../view"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Thumbnail URL (optional)
                  </label>
                  <input
                    name="thumbnailUrl"
                    value={form.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/poster.jpg"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Release Date (optional)
                  </label>
                  <input
                    name="releaseDate"
                    type="date"
                    value={form.releaseDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>

                {/* Live thumbnail preview */}
                {form.thumbnailUrl && (
                  <div className="overflow-hidden rounded-lg border border-zinc-700/50">
                    <p className="bg-zinc-800/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                      Thumbnail Preview
                    </p>
                    <img
                      src={form.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="aspect-video w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : editingFilm ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <PlusIcon className="h-4 w-4" />
                  )}
                  {isSubmitting
                    ? "Saving..."
                    : editingFilm
                    ? "Update Film"
                    : "Add Film"}
                </button>
              </form>
            </div>
          </div>

          {/* ── Films List Panel ── */}
          <div className="order-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                All Films{" "}
                <span className="text-zinc-500">({films.length})</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
              </div>
            ) : films.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-700/50 bg-zinc-900/40 py-20 text-center">
                <FilmIcon className="mx-auto h-12 w-12 text-zinc-700" />
                <p className="mt-4 text-sm text-zinc-500">
                  No films yet. Add your first film using the form.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {films.map((film) => (
                  <div
                    key={film.id}
                    className="group relative overflow-hidden rounded-xl border border-zinc-700/40 bg-zinc-900/50 shadow-lg transition-all duration-300 hover:border-zinc-600/60 hover:shadow-xl"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      {film.thumbnailUrl ? (
                        <img
                          src={film.thumbnailUrl}
                          alt={film.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                          <FilmIcon className="h-10 w-10 text-zinc-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

                      {/* Action buttons */}
                      <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() => startEditing(film)}
                          className="rounded-lg bg-amber-500/80 p-1.5 text-white shadow-lg backdrop-blur-sm transition hover:bg-amber-400"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(film.id)}
                          disabled={deletingId === film.id}
                          className="rounded-lg bg-red-500/80 p-1.5 text-white shadow-lg backdrop-blur-sm transition hover:bg-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white line-clamp-1">
                        {film.title}
                      </h3>
                      {film.description && (
                        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                          {film.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-[10px] text-zinc-500">
                        {film.releaseDate && (
                          <span>
                            {new Date(film.releaseDate).toLocaleDateString()}
                          </span>
                        )}
                        {film.views > 0 && (
                          <span>{film.views.toLocaleString()} views</span>
                        )}
                        {film.videoProvider && (
                          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
                            {film.videoProvider}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
