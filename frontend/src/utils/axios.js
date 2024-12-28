//src/utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8006',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers. Authorization = `Bearer ${token}`;
  }
  return config;
},(error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      window.location.href = '/unauthorized';
    } else if (!error.response) {
      // Handle network errors
      console.error('Network error occurred');
    }
    return Promise.reject(error);
  }
);

const endpoints = {
  shortenUrl: {
    post: (data) => api.post('/url', data)
  },
  getUrls: () => api.get('/'),
  getAnalytics: (shortId) => api.get(`/url/analytics/${shortId}`)
};

export default api;
