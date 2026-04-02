import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegistrationForm.css';
import { apiFetch } from '../utils/api';
import { setStoredAuth } from '../utils/auth';

const emptyMember = { name: '', role: '' };

export default function RegistrationForm() {
  const navigate = useNavigate();
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
      const response = await apiFetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStoredAuth({ token: data.token, user: data.user });
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/submit', { replace: true }), 1500);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form card">
      <h2>Director Registration</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-group">
        <label htmlFor="teamName">Team Name *</label>
        <input
          id="teamName"
          name="teamName"
          placeholder="Your Film Production Team"
          value={form.teamName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-section">
        <h3>Team Members</h3>
        <div className="members-list">
          {form.members.map((member, index) => (
            <div key={index} className="member-input-group">
              <div className="form-group">
                <label htmlFor={`member-name-${index}`}>Name</label>
                <input
                  id={`member-name-${index}`}
                  placeholder="Member Name"
                  value={member.name}
                  onChange={(event) => handleMemberChange(index, 'name', event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`member-role-${index}`}>Role</label>
                <input
                  id={`member-role-${index}`}
                  placeholder="e.g., Director, Cinematographer"
                  value={member.role}
                  onChange={(event) => handleMemberChange(index, 'role', event.target.value)}
                  required
                />
              </div>
              {form.members.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeMember(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addMember} className="btn btn-outline btn-sm">
          + Add Member
        </button>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
        {loading ? 'Registering...' : 'Create Account'}
      </button>

      <p className="text-center text-secondary mt-2">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
}
