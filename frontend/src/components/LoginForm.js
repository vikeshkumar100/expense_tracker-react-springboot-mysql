import React, { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await onLogin({ username: username.trim(), password });
      if (!res.success) {
        setError(res.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="form-row" style={{ flexDirection: 'column' }}>
        <label className="small-muted">Username</label>
        <input className="input" aria-label="username" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div className="form-row" style={{ flexDirection: 'column', marginTop: 8 }}>
        <label className="small-muted">Password</label>
        <input className="input" type="password" aria-label="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {error && <div className="small-muted" style={{ color: 'var(--danger)', marginTop: 10 }}>{error}</div>}
      <div style={{ marginTop: 14 }}>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </div>
    </form>
  );
}
