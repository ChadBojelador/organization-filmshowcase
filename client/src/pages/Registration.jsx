// frontend/src/pages/Registration.jsx
import { useState } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";

const createEmptyMember = () => ({ name: "", role: "" });

function Registration() {
  const [formData, setFormData] = useState({
    directorName: "",
    email: "",
    password: "",
  });
  const [members, setMembers] = useState([createEmptyMember()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    setMembers((prev) =>
      prev.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member
      )
    );
  };

  const handleAddMember = () => {
    setMembers((prev) => [...prev, createEmptyMember()]);
  };

  const handleRemoveMember = (index) => {
    setMembers((prev) => prev.filter((_, memberIndex) => memberIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        directorName: formData.directorName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        members: members
          .map((member) => ({
            name: member.name.trim(),
            role: member.role.trim(),
          }))
          .filter((member) => member.name || member.role),
      };

      const response = await axios.post("/api/register", payload);
      setSuccessMessage(response.data?.message || "Registration successful.");
      setFormData({ directorName: "", email: "", password: "" });
      setMembers([createEmptyMember()]);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Register Director
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Create your account and add your team members.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="directorName"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Director Name
              </label>
              <input
                id="directorName"
                name="directorName"
                type="text"
                value={formData.directorName}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                required
                minLength={6}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Members</h2>
              <button
                type="button"
                onClick={handleAddMember}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Add Member
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={`member-${index}`}
                  className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <input
                    type="text"
                    placeholder="Member name"
                    value={member.name}
                    onChange={(event) => handleMemberChange(index, "name", event.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={member.role}
                    onChange={(event) => handleMemberChange(index, "role", event.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-700"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    disabled={members.length === 1}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/40"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {successMessage && (
            <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </form>
      </section>
    </AppLayout>
  );
}

export default Registration;
