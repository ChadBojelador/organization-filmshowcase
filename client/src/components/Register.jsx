import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerDirector } from "../services/directorAuthService";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

const initialErrors = {
  name: "",
  email: "",
  password: "",
};

function Register({ redirectPath = "/login" }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const nextErrors = { ...initialErrors };

    if (!form.name.trim()) {
      nextErrors.name = "Director name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() ? "" : prev[name],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await registerDirector({
        ...form,
        members: [],
      });

      setSuccess(data?.message || "Director registered successfully.");
      setForm(initialForm);
      setErrors(initialErrors);

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 900);
    } catch (requestError) {
      setError(requestError.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Director Register</h1>
      <p className="mt-1 text-sm text-slate-600">Create a new director account.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
            Director Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Juan Dela Cruz"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 transition focus:ring-2 ${
              errors.name ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>

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
            autoComplete="email"
            placeholder="director@example.com"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 transition focus:ring-2 ${
              errors.email ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Enter your password"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 transition focus:ring-2 ${
              errors.password ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
}

export default Register;
