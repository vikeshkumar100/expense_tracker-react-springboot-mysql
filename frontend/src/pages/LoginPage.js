import React from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage({ onLogin, onNavigate }) {
  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 28 }}>💸</div>
          <div>
            <h2 style={{ margin: 0 }}>Welcome back</h2>
            <div className="small-muted">Log in to see your personal expenses</div>
          </div>
        </div>
        <LoginForm onLogin={onLogin} />
        <div style={{ marginTop: 12 }}>
          <span className="small-muted">Don't have an account? </span>
          <button className="btn btn-link" onClick={() => onNavigate('signup')}>Sign up</button>
        </div>
      </div>
    </div>
  );
}
