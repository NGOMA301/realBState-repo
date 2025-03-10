import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Interceptor to attach the token from cookies or store
api.interceptors.request.use((config) => {
  const tokenFromCookies = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_ad_token='))
    ?.split('=')[1];

  const tokenFromStore = useAuthStore.getState().token; // Get token from store

  const token = tokenFromStore || tokenFromCookies; // Use store token if available, otherwise use cookie token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor to handle unauthorized responses
api.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
