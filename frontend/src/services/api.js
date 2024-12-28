// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8006',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const shortenUrl = async (url) => {
  const response = await api.post('/url', { url });
  return response.data;
};

export const getUrls = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getAnalytics = async (shortId) => {
  const response = await api.get(`/url/analytics/${shortId}`);
  return response.data;
};
