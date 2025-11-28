// js/api.js
const API_BASE = 'http://127.0.0.1:3000/api/v1';

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // إذا كان في FormData (مثل الصور)، ما تضيفش Content-Type
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  // 401 → Auto Logout
  if (response.status === 401) {
    alert('Session expired. Please login again.');
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
    return null;
  }

  return response;
}