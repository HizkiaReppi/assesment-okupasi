import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Check token expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp < Date.now() / 1000;
  } catch (e) {
    console.error('Error decoding token', e);
    return true;
  }
};

// Force logout
const forceLogout = () => {
  alert('Session has ended. Please log in again.');
  Cookies.remove('Authorization');
  Cookies.remove('r');
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = '/login';
};

// Refresh token
const refreshToken = async () => {
  try {
    const response: AxiosResponse = await apiClient.put('/authentication/refresh');
    const { accessToken, refreshToken } = response.data;

    Cookies.set('Authorization', accessToken, { httpOnly: true });
    Cookies.set('r', refreshToken, { httpOnly: true });

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    forceLogout();
    throw error;
  }
};

// Check token expiration and refresh if necessary
const checkTokenExpiration = async () => {
  const authToken = Cookies.get('Authorization');
  const rToken = Cookies.get('r');

  if (authToken && isTokenExpired(authToken)) {
    if (rToken && !isTokenExpired(rToken)) {
      await refreshToken();
    } else {
      forceLogout();
    }
  }
};

// Check token expiration every minute
setInterval(checkTokenExpiration, 60 * 1000);

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    await checkTokenExpiration();
    const authToken = Cookies.get('Authorization');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response } = error;

    if (response && (response.status === 401 || response.status === 403)) {
      await checkTokenExpiration();
      if (response.status === 401 || response.status === 403) {
        forceLogout();
      }
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

// Timer for logout
const setLogoutTimer = () => {
  setTimeout(() => {
    alert('Session has ended. Please log in again.');
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  }, 15 * 60 * 1000); // 15 minutes in milliseconds
};

// Login
export const login = async (email: string, password: string) => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/login', { email, password });
    sessionStorage.setItem('isLoggedIn', 'true');
    setLogoutTimer();
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Logout
export const logout = async () => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/logout');
    Cookies.remove('Authorization');
    Cookies.remove('r');
    sessionStorage.removeItem('isLoggedIn');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response: AxiosResponse = await apiClient.get('/user');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const response: AxiosResponse = await apiClient.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (nama: string, email: string, password: string) => {
  try {
    const response: AxiosResponse = await apiClient.post('/user', { nama, email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (id: string, email: string, password: string) => {
  try {
    const emailResponse: AxiosResponse = await apiClient.patch('/user/email', { email });
    const passwordResponse: AxiosResponse = await apiClient.patch('/user/password', { password });
    return { emailResponse: emailResponse.data, passwordResponse: passwordResponse.data };
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response: AxiosResponse = await apiClient.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changeEmail = async (email: string) => {
  try {
    const response: AxiosResponse = await apiClient.patch('/user/email', { email });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (password: string) => {
  try {
    const response: AxiosResponse = await apiClient.patch('/user/password', { password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
