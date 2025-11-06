import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

function groupByDateSum(expenses) {
  const map = new Map();
  (expenses || []).forEach(e => {
    const d = e.date ? e.date : 'Unknown';
    const amt = Number(e.amount) || 0;
    map.set(d, (map.get(d) || 0) + amt);
  });
  const arr = Array.from(map.entries()).map(([date, total]) => ({ date, total }));
  // sort ascending by date
  arr.sort((a, b) => {
    if (a.date === 'Unknown') return 1;
    if (b.date === 'Unknown') return -1;
    return new Date(a.date) - new Date(b.date);
  });
  return arr;
}

export default function ExpenseChart({ expenses = [] }) {
  const data = useMemo(() => groupByDateSum(expenses), [expenses]);

  if (!data || data.length === 0) {
    return <div className="empty">No data to display on chart.</div>;
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
          <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
