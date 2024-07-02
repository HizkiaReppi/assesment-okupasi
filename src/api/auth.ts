import { AxiosResponse } from 'axios';
import {jwtDecode} from 'jwt-decode';
import { apiClient, handleError } from './apiClient';

// Fungsi login
export const login = async (email: string, password: string) => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/login', { email, password });
    const token = response.data.data.token;
    const decodedToken: any = jwtDecode(token);

    sessionStorage.setItem('Authorization', token); // Store token without 'Bearer ' prefix
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

export const refreshToken = async () => {
  try {
    console.log('Attempting to refresh token...');
    const response = await apiClient.put('/authentication/refresh', {}, { withCredentials: true });
    if (response.data.status === 'success') {
      const token = response.data.data.token; 
      // console.log('Token refreshed successfully:', token);
      sessionStorage.setItem("Authorization", token); 
      const decodedToken: any = jwtDecode(token);
      sessionStorage.setItem('isSuperUser', decodedToken.is_super ? 'true' : 'false');
    } else {
      // console.error('Failed to refresh token, status:', response.data.status);
      throw new Error('Failed to refresh token');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error refreshing token:', error.message);
    } else {
      console.error('Error refreshing token:', String(error));
    }
    forceLogout();  
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

