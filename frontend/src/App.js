import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TotalExpense from './components/TotalExpense';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const API_BASE = process.env.EXPENSE_API_URL || 'http://localhost:8080/api';

function handleAxiosError(err) {
  if (err.response) {
    return `Server responded with status ${err.response.status}: ${err.response.data?.message || JSON.stringify(err.response.data)}`;
  } else if (err.request) {
    return 'No response received from server. Is the backend running?';
  } else {
    return `Request error: ${err.message}`;
  }
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('authUser');
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  });
  const [route, setRoute] = useState('login');

  async function fetchExpenses(userId) {
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      if (userId) headers['X-User-Id'] = userId;
      else if (user) headers['X-User-Id'] = user.id;
      const resp = await axios.get(`${API_BASE}/expenses`, { headers });
      if (!Array.isArray(resp.data)) throw new Error('Invalid response from server');
      const normalized = resp.data.map(e => ({
        ...e,
        date: e.date ? e.date.slice(0, 10) : null
      }));
      setExpenses(normalized);
    } catch (err) {
      setError(handleAxiosError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) fetchExpenses(user.id);
    else {
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  // Authentication handlers
  async function handleLogin(creds) {
    try {
      const resp = await axios.post(`${API_BASE}/auth/login`, creds, { headers: { 'Content-Type': 'application/json' } });
      const u = resp.data;
      localStorage.setItem('authUser', JSON.stringify(u));
      setUser(u);
      // fetch expenses for this user
      await fetchExpenses(u.id);
      return { success: true };
    } catch (err) {
      return { success: false, message: handleAxiosError(err) };
    }
  }

  async function handleSignup(creds) {
    try {
      await axios.post(`${API_BASE}/auth/signup`, creds, { headers: { 'Content-Type': 'application/json' } });
      // auto-login after signup
      return await handleLogin(creds);
    } catch (err) {
      return { success: false, message: handleAxiosError(err) };
    }
  }

  function handleLogout() {
    localStorage.removeItem('authUser');
    setUser(null);
    setRoute('login');
  }

  async function addExpense(payload) {
    setError(null);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user) headers['X-User-Id'] = user.id;
      const resp = await axios.post(`${API_BASE}/expenses`, payload, { headers });
      // append returned expense
      const returned = resp.data;
      returned.date = returned.date ? returned.date.slice(0, 10) : returned.date;
      setExpenses(prev => [returned, ...prev]);
      return { success: true };
    } catch (err) {
      const message = handleAxiosError(err);
      setError(message);
      return { success: false, message };
    }
  }

  async function deleteExpense(id) {
    setError(null);
    try {
      const headers = {};
      if (user) headers['X-User-Id'] = user.id;
      await axios.delete(`${API_BASE}/expenses/${id}`, { headers });
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(handleAxiosError(err));
    }
  }

  const total = expenses.reduce((sum, e) => {
    const amt = Number(e.amount);
    if (!Number.isFinite(amt)) return sum;
    return sum + amt;
  }, 0);

  return (
    <div className="app-root">
      {!user ? (
        <div className="auth-topbar">
          <div className="auth-topbar-inner">
            <div className="logo">💸</div>
            <div className="small-muted" style={{ marginLeft: 8 }}>Personal expenses</div>
          </div>
        </div>
      ) : (
        <div className="app-container">
          <div className="card header">
            <div>
              <div className="title">Expense Tracker</div>
              <div className="small-muted">Track your expenses quickly</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="total-amount">₹{total.toFixed(2)}</div>
              {user ? (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>{user.username}</div>
                  <button className="btn btn-link" onClick={handleLogout}>Logout</button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {!user ? (
        route === 'login' ? (
          <LoginPage onLogin={handleLogin} onNavigate={setRoute} />
        ) : (
          <SignupPage onSignup={handleSignup} onNavigate={setRoute} />
        )
      ) : (
        <div className="app-container">
          <div className="card">
            <ExpenseForm onAdd={addExpense} loading={loading} />
          </div>

          <div className="card">
            <ExpenseChart expenses={expenses} />
          </div>

          <div className="card">
            <div style={{ marginBottom: 8, fontWeight: 600 }}>Expenses</div>
            {loading ? (
              <div className="empty">Loading...</div>
            ) : error ? (
              <div className="empty" style={{ color: 'var(--danger)' }}>{error}</div>
            ) : (
              <ExpenseList expenses={expenses} onDelete={deleteExpense} />
            )}
          </div>

          <div className="footer-note card">
            Backend API: {API_BASE}
          </div>
        </div>
      )}
    </div>
  );
}
