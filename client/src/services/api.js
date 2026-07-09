import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors (like token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

// Profile Services
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
  return response.data;
};

// Income Services
export const getIncomes = async () => {
  const response = await api.get('/income');
  return response.data;
};

export const addIncome = async (incomeData) => {
  const response = await api.post('/income', incomeData);
  return response.data;
};

export const updateIncome = async (id, incomeData) => {
  const response = await api.put(`/income/${id}`, incomeData);
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await api.delete(`/income/${id}`);
  return response.data;
};

// Expense Services
export const getExpenses = async () => {
  const response = await api.get('/expense');
  return response.data;
};

export const addExpense = async (expenseData) => {
  const response = await api.post('/expense', expenseData);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await api.put(`/expense/${id}`, expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expense/${id}`);
  return response.data;
};

// Analytics Services
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export default api;
