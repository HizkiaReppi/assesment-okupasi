import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { apiClient, handleError } from './apiClient';

// Fungsi login
export const login = async (email: string, password: string) => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/login', { email, password });
    const token = response.data.data.token; // Token dari respons body
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // console.log('Token received:', token);
    // console.log('Token expiry:', decodedToken.exp);

    if (decodedToken.exp < currentTime) {
      console.log('Token sudah expired, melakukan refresh token...');
      await refreshToken();
    } else {
      // Token valid, simpan di localStorage
      setSessionToken(token, decodedToken.is_super);
    }

    return { token, isSuperUser: decodedToken.is_super };
  } catch (error) {
    handleError(error);
  }
};

// Fungsi logout
export const logout = async () => {
  try {
    await apiClient.post('/user/logout');
    clearSession();
  } catch (error) {
    handleError(error);
  }
};

// Fungsi refresh token
export const refreshToken = async () => {
  try {
    // console.log('Attempting to refresh token...');
    const response: AxiosResponse = await apiClient.put('/authentication/refresh', {}, { withCredentials: true });

    if (response.data.status === 'success') {
      const token = response.data.data.token;
      const decodedToken: any = jwtDecode(token);
      setSessionToken(token, decodedToken.is_super);
      return { token, isSuperUser: decodedToken.is_super };
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    forceLogout();
    throw error;
  }
};

// Fungsi force logout
export const forceLogout = async () => {
  clearSession();
  alert('Session has ended. Please log in again.');
};

// Fungsi untuk menghapus session
const clearSession = () => {
  document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  localStorage.removeItem('Authorization');
  localStorage.removeItem('isSuperUser');
  window.location.href = '/login';
};

// Fungsi untuk menyimpan token di localStorage
const setSessionToken = (token: string, isSuperUser: boolean) => {
  localStorage.setItem('Authorization', token);
  localStorage.setItem('isSuperUser', isSuperUser ? 'true' : 'false');
};

// Fungsi untuk mengecek apakah user adalah super user
export const isUserSuper = (): boolean => {
  return localStorage.getItem('isSuperUser') === 'true';
};

// Fungsi untuk menunda eksekusi
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk menginisialisasi auth state saat halaman dimuat
const initializeAuthState = async () => {
  const token = localStorage.getItem('Authorization');
  // console.log('Initializing auth state, token found:', token);

  if (token) {
    try {
      await delay(6000000); // 1 jam
      console.log('Attempting to refresh token after delay...');
      const response = await refreshToken();

      console.log('Token refreshed successfully:', response);

      localStorage.setItem('Authorization', response.token);
      localStorage.setItem('isSuperUser', response.isSuperUser ? 'true' : 'false');
    } catch (error) {
      console.error('Error during token initialization:', error);
      forceLogout();
    }
  } else {
    console.log('No token found in localStorage.');
  }
};

// Panggil initializeAuthState saat halaman dimuat
window.onload = initializeAuthState;
