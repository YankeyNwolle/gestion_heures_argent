import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attache le token automatiquement à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login    = (email, password) => API.post('/auth/login', { email, password });
export const register = (data)            => API.post('/auth/register', data);
export const logout   = ()                => API.post('/auth/logout');