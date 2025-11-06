import React from 'react';

export default function TotalExpense({ amount }) {
  const valid = typeof amount === 'number' && Number.isFinite(amount);
  return (
    <div className="card header">
      <div>
        <div className="title">Total Expenses</div>
      </div>
      <div className="total-amount">₹{valid ? amount.toFixed(2) : '0.00'}</div>
    </div>
  );
}
