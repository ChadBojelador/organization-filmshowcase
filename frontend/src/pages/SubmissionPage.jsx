import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { clearStoredAuth, getStoredAuth } from "../utils/auth";

function SubmissionPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    filmTitle: "",
    videoLink: "",
    posterLink: "",
  });
  const [director, setDirector] = useState(null);
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const { token: storedToken, director: storedDirector } = getStoredAuth();

    if (!storedToken || !storedDirector) {
      navigate("/login", { replace: true });
      return;
    }

    setToken(storedToken);
    setDirector(storedDirector);
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiFetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit film.");
      }

      setSuccess("Film submitted successfully. It is now pending moderation.");
      setForm({ filmTitle: "", videoLink: "", posterLink: "" });
    } catch (submitError) {
      const message = submitError.message || "Failed to submit film.";
      setError(message);

      if (message.toLowerCase().includes("token") || message.toLowerCase().includes("authorized")) {
        clearStoredAuth();
        navigate("/login", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-slate-900">Submission Form</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access granted. Only logged-in directors can submit films.
        </p>

        {director ? (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Team: {director.teamName}</p>
            <p className="mt-1">Members:</p>
            <ul className="mt-1 list-disc pl-5">
              {Array.isArray(director.members) ? director.members.map((member, index) => (
                <li key={`${member.name}-${index}`}>{member.name} — {member.role}</li>
              )) : null}
            </ul>
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="filmTitle">Film Title</label>
            <input id="filmTitle" name="filmTitle" value={form.filmTitle} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="posterLink">Poster Google Drive Link</label>
            <input id="posterLink" name="posterLink" value={form.posterLink} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="videoLink">Video Google Drive Link</label>
            <input id="videoLink" name="videoLink" value={form.videoLink} onChange={handleChange} required />
          </div>

          {error ? <div className="alert alert-error">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Film"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default SubmissionPage;
