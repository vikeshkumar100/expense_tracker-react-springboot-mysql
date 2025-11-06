import React, { useState } from 'react';

export default function ExpenseList({ expenses = [], onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!id) return;
    if (!window.confirm('Delete this expense?')) return;
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (!Array.isArray(expenses) || expenses.length === 0) {
    return <div className="empty">No expenses yet. Add one above.</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="expense-list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{exp.name}</td>
              <td>₹{Number(exp.amount).toFixed(2)}</td>
              <td className="small-muted">{exp.date}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(exp.id)}
                  disabled={deletingId === exp.id}
                >
                  {deletingId === exp.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
