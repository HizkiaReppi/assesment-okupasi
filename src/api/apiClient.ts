import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { refreshToken, forceLogout } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw error.response ? error.response.data : new Error('An error occurred');
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp < Date.now() / 1000;
  } catch (e) {
    console.error('Error decoding token', e);
    return true;
  }
};

const checkTokenExpiration = async () => {
  const authToken = Cookies.get('Authorization');
  if (authToken && isTokenExpired(authToken)) {
    try {
      await refreshToken();
    } catch (error) {
      forceLogout();
    }
  }
};

// Periksa token setiap kali request dilakukan
apiClient.interceptors.request.use(
  async (config) => {
    await checkTokenExpiration();
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Tangani respons error
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response } = error;
    if (response && response.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export { apiClient, handleError };
