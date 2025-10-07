export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

export async function apiRequest(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('token');
  console.log(`Making ${method} request to ${API_BASE}${path}`);
  
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  console.log(`Response status: ${res.status}`);
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    console.error('API Error:', data);
    throw new Error(data.message || 'Request failed');
  }
  
  console.log('API Success:', data);
  return data;
}


