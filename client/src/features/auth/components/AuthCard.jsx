import { useState } from "react";
import { signIn, signUp } from "../../../services/authService";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
};

function AuthCard() {
  const [mode, setMode] = useState("sign-in");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isSignUp = mode === "sign-up";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = isSignUp
        ? await signUp(form)
        : await signIn({ email: form.email, password: form.password });

      setSuccess(
        payload?.message ||
          (isSignUp
            ? "Sign-up completed. Check your email if confirmation is enabled."
            : "Signed in successfully.")
      );
    } catch (requestError) {
      setError(requestError.message || "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Starter Auth</h1>
      <p className="mt-1 text-sm text-slate-600">
        {isSignUp ? "Create an account" : "Sign in to continue"}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {isSignUp && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 transition focus:ring-2"
              placeholder="Jane Doe"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 transition focus:ring-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 transition focus:ring-2"
            placeholder="Minimum 6 characters"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={toggleMode}
        className="mt-4 w-full text-sm text-slate-600 underline underline-offset-2 hover:text-slate-900"
      >
        {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
      </button>
    </section>
  );
}

export default AuthCard;
