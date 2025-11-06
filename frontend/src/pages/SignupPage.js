import React from 'react';
import SignupForm from '../components/SignupForm';

export default function SignupPage({ onSignup, onNavigate }) {
  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 28 }}>🪙</div>
          <div>
            <h2 style={{ margin: 0 }}>Create your account</h2>
            <div className="small-muted">Quick signup — then manage your expenses privately</div>
          </div>
        </div>
        <SignupForm onSignup={onSignup} />
        <div style={{ marginTop: 12 }}>
          <span className="small-muted">Already have an account? </span>
          <button className="btn btn-link" onClick={() => onNavigate('login')}>Login</button>
        </div>
      </div>
    </div>
  );
}
