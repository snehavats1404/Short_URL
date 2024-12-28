  // src/services/auth.js
import api from '../utils/axios';

export const login = async (credentials) => {
  const response = await api.post('/user/login', credentials);
  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post('/user', userData);
  return response.data;
};

export const logout = async () => {
  // Clear local storage and cookies
  localStorage.removeItem('token');
  document.cookie = 'token=; expires=0; path=/;';
};
  