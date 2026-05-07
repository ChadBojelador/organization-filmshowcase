import { useState } from "react";
import { FilmIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import AdminDashboard from "../pages/AdminDashboard";
import { loginDirector } from "../services/directorAuthService";

/**
 * AdminLoginGate — wraps AdminDashboard behind an inline login form.
 * Mounted only at the secret /admin/123 URL.
 * If a valid token already exists in localStorage the admin panel renders directly.
 */
function AdminLoginGate() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already authenticated — render the admin dashboard
  if (token) {
    return <AdminDashboard />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginDirector(form);

      if (!data?.token) {
        throw new Error("Login failed. No token returned.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0c0a14] via-[#12101e] to-[#0d0b18] px-4">
      <div className="w-full max-w-sm">
        {/* Logo / branding */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <FilmIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">FESTORAMA</h1>
            <p className="mt-1 text-xs text-zinc-500 uppercase tracking-widest">Admin Access</p>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-2">
            <LockClosedIcon className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Sign in to continue</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
              >
                Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="director@example.com"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400"
              >
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <LockClosedIcon className="h-4 w-4" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginGate;
