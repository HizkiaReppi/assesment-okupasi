import { AxiosResponse } from 'axios';
import {jwtDecode} from 'jwt-decode';
import { apiClient, handleError } from './apiClient';

// Fungsi login
export const login = async (email: string, password: string) => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/login', { email, password });
    const token = response.data.data.token;
    const decodedToken: any = jwtDecode(token);

    sessionStorage.setItem('Authorization', `Bearer ${token}`);
    sessionStorage.setItem('isSuperUser', decodedToken.is_super ? 'true' : 'false'); // Simpan status super user

    return {
      token,
      isSuperUser: decodedToken.is_super
    };
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
    const response = await apiClient.put('/api/v1/authentication/refresh', {}, { withCredentials: true });
    if (response.data.status === 'success') {
      const token = sessionStorage.getItem('Authorization')?.split(' ')[1];
      if (token) {
        const decodedToken: any = jwtDecode(token);
        sessionStorage.setItem('isSuperUser', decodedToken.is_super ? 'true' : 'false');
      }
    }
  } catch (error) {
    console.error('Error refreshing token:', (error as any).response ? (error as any).response.data : (error as any).message);
    forceLogout();  // Directly call forceLogout if refreshToken fails
    throw error;
  }
};

// Fungsi force logout
export const forceLogout = async () => {
  await apiClient.post('/user/logout');
  alert('Session has ended. Please log in again.');
  clearSession();
};

// Fungsi untuk menghapus session storage
const clearSession = () => {
  sessionStorage.removeItem('Authorization');
  sessionStorage.removeItem('isSuperUser');
  // Hapus cookies authorization
  document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/login';
};

// Fungsi untuk mengecek apakah user adalah super user
export const isUserSuper = (): boolean => {
  return sessionStorage.getItem('isSuperUser') === 'true';
};
