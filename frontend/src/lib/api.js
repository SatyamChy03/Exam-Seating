import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

export async function generateSeating(payload) {
  const response = await api.post('/generate', payload);
  return response.data;
}

export function getApiBaseUrl() {
  return apiBaseUrl;
}