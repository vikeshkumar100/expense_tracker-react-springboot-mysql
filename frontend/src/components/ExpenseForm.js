import React, { useState } from 'react';

function isValidDateString(s) {
  if (!s) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}

export default function ExpenseForm({ onAdd }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  function resetForm() {
    setName('');
    setAmount('');
    setDate('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);

    // validation
    if (!name.trim()) {
      setLocalError('Please provide a name for the expense.');
      return;
    }
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      setLocalError('Amount must be a number greater than 0.');
      return;
    }
    if (!isValidDateString(date)) {
      setLocalError('Please provide a valid date.');
      return;
    }

    const payload = {
      name: name.trim(),
      amount: num,
      date: date
    };

    setSubmitting(true);
    try {
      const result = await onAdd(payload);
      if (result && result.success === false) {
        setLocalError(result.message || 'Failed to add expense.');
      } else {
        setSuccessMsg('Expense added.');
        resetForm();
        setTimeout(() => setSuccessMsg(null), 2000);
      }
    } catch (err) {
      setLocalError('Unexpected error when adding expense.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Add Expense</div>
      <div className="form-row" style={{ marginBottom: 10 }}>
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="Amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <input
          className="input"
          placeholder="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add'}
        </button>
      </div>
      {localError && <div style={{ color: 'var(--danger)', marginBottom: 8 }}>{localError}</div>}
      {successMsg && <div style={{ color: 'green', marginBottom: 8 }}>{successMsg}</div>}
    </form>
  );
}
