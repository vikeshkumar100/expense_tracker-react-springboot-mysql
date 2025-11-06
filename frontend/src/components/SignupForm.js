import React, { useState } from 'react';

export default function SignupForm({ onSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await onSignup({ username: username.trim(), password });
      if (!res.success) {
        setError(res.message || 'Signup failed');
      } else {
        setSuccess('Signup successful — you are now logged in');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="form-row" style={{ flexDirection: 'column' }}>
        <label className="small-muted">Username</label>
        <input className="input" aria-label="username" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div className="form-row" style={{ flexDirection: 'column', marginTop: 8 }}>
        <label className="small-muted">Password</label>
        <input className="input" type="password" aria-label="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {error && <div className="small-muted" style={{ color: 'var(--danger)', marginTop: 10 }}>{error}</div>}
      {success && <div className="small-muted" style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      <div style={{ marginTop: 14 }}>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign up'}</button>
      </div>
    </form>
  );
}
