import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.EXPENSE_API_URL || 'http://localhost:8081/api';

export default function CategoryController({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${API_BASE}/categories`);
        setCategories(response.data);
      } catch (error) {
        setError('Failed to fetch categories. Please try again later.');
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  async function addCategory() {
    if (!newCategory.trim()) return;
    try {
      const response = await axios.post(`${API_BASE}/categories`, { name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory('');
    } catch (error) {
      setError('Failed to add category. Please try again.');
      console.error('Error adding category:', error);
    }
  }

  return (
    <div className="card">
      <h3>Manage Categories</h3>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {categories.map((category) => (
          <li key={category.id} onClick={() => onCategorySelect(category.name)}>{category.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New category"
      />
      <button onClick={addCategory}>Add Category</button>
    </div>
  );
}