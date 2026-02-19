import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  getSecurityQuestion: (email) => api.post('/api/auth/forgot-password', { email })
};

export const bankAPI = {
  getBalance: () => api.get('/api/balance'),
  transfer: (data) => api.post('/api/transfer', data),
  getTransactions: () => api.get('/api/transactions'),
  updateProfile: (data) => api.put('/api/profile', data),
  changePassword: (data) => api.put('/api/change-password', data)
};

export default api;
