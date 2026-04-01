import { useState } from 'react';

const emptyMember = { name: '', role: '' };

export default function RegistrationForm() {
  const [form, setForm] = useState({
    teamName: '',
    email: '',
    password: '',
    members: [{ ...emptyMember }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberChange = (index, field, value) => {
    setForm((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [field]: value };
      return { ...prev, members };
    });
  };

  const addMember = () => {
    setForm((prev) => ({ ...prev, members: [...prev.members, { ...emptyMember }] }));
  };

  const removeMember = (index) => {
    setForm((prev) => {
      if (prev.members.length === 1) return prev;
      const members = prev.members.filter((_, idx) => idx !== index);
      return { ...prev, members };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setSuccess('Registration successful.');
      setForm({
        teamName: '',
        email: '',
        password: '',
        members: [{ ...emptyMember }]
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Director Registration</h2>

      <input
        name="teamName"
        placeholder="Team Name"
        value={form.teamName}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <h3>Members</h3>
      {form.members.map((member, index) => (
        <div key={index}>
          <input
            placeholder="Member Name"
            value={member.name}
            onChange={(event) => handleMemberChange(index, 'name', event.target.value)}
            required
          />
          <input
            placeholder="Role"
            value={member.role}
            onChange={(event) => handleMemberChange(index, 'role', event.target.value)}
            required
          />
          <button type="button" onClick={() => removeMember(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addMember}>Add Member</button>
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  );
}
