import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map(callback => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Utility function to check token expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp < Date.now() / 1000;
  } catch (e) {
    console.error('Error decoding token', e);
    return true;
  }
};

// Utility function to refresh token
const refreshToken = async () => {
  try {
    const response = await apiClient.post('/user/refresh-token');
    const newToken = response.data.token;
    Cookies.set('token', newToken, { httpOnly: true }); // Set the new token as an HTTP-only cookie
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    onTokenRefreshed(newToken);
  } catch (error) {
    alert('Session has ended. Please log in again.');
    Cookies.remove('token'); // Clear the cookie
    window.location.href = '/login';
    throw error;
  } finally {
    isRefreshing = false;
  }
};

// Set up a periodic token refresh
setInterval(() => {
  const token = Cookies.get('token');
  if (token && !isTokenExpired(token)) {
    refreshToken();
  }
}, 15 * 60 * 1000); // 15 minutes in milliseconds

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token && isTokenExpired(token)) {
      alert('Session has ended. Please log in again.');
      Cookies.remove('token'); // Clear the cookie
      window.location.href = '/login';
      return Promise.reject(new Error('Token expired'));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response && response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await apiClient.post('/user/refresh-token');
          const newToken = data.token;

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          onTokenRefreshed(newToken);
        } catch (refreshError) {
          alert('Session has ended. Please log in again.');
          Cookies.remove('token'); // Clear the cookie
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      originalRequest._retry = true;

      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw error.response ? error.response.data : new Error('An error occurred');
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/user/login', { email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/user');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (nama: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/user', { nama, email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (id: string, email: string, password: string) => {
  try {
    const emailResponse = await apiClient.patch('/user/email', { email });
    const passwordResponse = await apiClient.patch('/user/password', { password });
    return { emailResponse: emailResponse.data, passwordResponse: passwordResponse.data };
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changeEmail = async (email: string) => {
  try {
    const response = await apiClient.patch('/user/email', { email });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (password: string) => {
  try {
    const response = await apiClient.patch('/user/password', { password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/user/logout');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
