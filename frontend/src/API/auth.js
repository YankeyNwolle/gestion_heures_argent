
const API_BASE_URL = 'http://localhost:5000/API/auth';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload?.message || payload?.error || 'Erreur API');
    error.response = { data: payload, status: response.status };
    throw error;
  }

  return { data: payload, status: response.status };
}

export const register = async (userData) =>
  request('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const login = async (email, password) =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const logout = async () =>
  request('/logout', {
    method: 'POST',
  });

// Backward compatibility with previous name.
export const registerUser = register;