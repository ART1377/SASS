import axios from 'axios';
import { getSession } from 'next-auth/react';
import { ROUTES } from '../lib/routes';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user) {
      config.headers.Authorization = `Bearer ${session.user.id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  }
);

export { apiClient };
