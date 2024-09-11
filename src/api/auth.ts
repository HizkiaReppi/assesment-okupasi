import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { apiClient, handleError } from './apiClient';

// Constants
const REFRESH_INTERVAL = 6000000; // 60 seconds
const INITIAL_DELAY = 1000000; // 10 seconds

// Types
interface DecodedToken {
  exp: number;
  is_super: boolean;
}

interface AuthResponse {
  token: string;
  isSuperUser: boolean;
}

// Session Management Functions
const setSessionToken = (token: string, isSuperUser: boolean): void => {
  sessionStorage.setItem('Authorization', token);
  sessionStorage.setItem('isSuperUser', isSuperUser.toString());
};

const clearSession = (): void => {
  document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  sessionStorage.removeItem('Authorization');
  sessionStorage.removeItem('isSuperUser');
  localStorage.removeItem('refreshTokenIntervalId');
  window.location.href = '/login';
};

export const isUserSuper = (): boolean => {
  return sessionStorage.getItem('isSuperUser') === 'true';
};

// Token Management Functions
const decodeToken = (token: string): DecodedToken => {
  return jwtDecode(token) as DecodedToken;
};

const isTokenExpired = (decodedToken: DecodedToken): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};

// API Functions
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/login', { email, password });
    const { token } = response.data.data;
    const decodedToken = decodeToken(token);

    if (isTokenExpired(decodedToken)) {
      console.log('Token expired, refreshing...');
      return await refreshToken();
    }

    setSessionToken(token, decodedToken.is_super);
    startPeriodicRefresh();

    return { token, isSuperUser: decodedToken.is_super };
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/user/logout');
    stopPeriodicRefresh();
    clearSession();
  } catch (error) {
    handleError(error);
  }
};

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse = await apiClient.put(
      '/authentication/refresh',
      {},
      { withCredentials: true }
    );

    if (response.data.status === 'success') {
      const { token } = response.data.data;
      const decodedToken = decodeToken(token);
      setSessionToken(token, decodedToken.is_super);
      return { token, isSuperUser: decodedToken.is_super };
    }
    
    throw new Error('Failed to refresh token');
  } catch (error) {
    console.error('Error refreshing token:', error);
    await forceLogout();
    throw error;
  }
};

// Utility Functions
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Periodic Refresh Functions
const startPeriodicRefresh = (): void => {
  stopPeriodicRefresh();
  const intervalId = setInterval(async () => {
    try {
      await refreshToken();
      console.log('Periodic token refresh successful');
    } catch (error) {
      console.error('Periodic token refresh failed:', error);
    }
  }, REFRESH_INTERVAL);
  localStorage.setItem('refreshTokenIntervalId', intervalId.toString());
};

const stopPeriodicRefresh = (): void => {
  const intervalId = localStorage.getItem('refreshTokenIntervalId');
  if (intervalId) {
    clearInterval(parseInt(intervalId));
    localStorage.removeItem('refreshTokenIntervalId');
  }
};

// Logout Functions
export const forceLogout = async (): Promise<void> => {
  stopPeriodicRefresh();
  clearSession();
  alert('Session has ended. Please log in again.');
};

// Initialization
const initializeAuthState = async (): Promise<void> => {
  const token = sessionStorage.getItem('Authorization');
  if (token) {
    try {
      await delay(INITIAL_DELAY);
      const response = await refreshToken();
      setSessionToken(response.token, response.isSuperUser);
      startPeriodicRefresh();
    } catch (error) {
      console.error('Error during token initialization:', error);
      await forceLogout();
    }
  } else {
    console.log('No token found in session storage.');
  }
};

// Initialize auth state when the page loads
window.onload = initializeAuthState;