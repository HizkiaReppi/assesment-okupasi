import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { apiClient, handleError } from './apiClient';

export const login = async (email: string, password: string) => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/login', { email, password });
    Cookies.set('Authorization', response.headers['Authorization']);
    Cookies.set('r', response.headers['r']);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/logout');
    Cookies.remove('Authorization');
    Cookies.remove('r');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const refreshToken = async () => {
  try {
    const response: AxiosResponse = await apiClient.put('/authentication/refresh');
    Cookies.set('Authorization', response.headers['Authorization']);
    Cookies.set('r', response.headers['r']);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const forceLogout = () => {
  alert('Session has ended. Please log in again.');
  Cookies.remove('Authorization');
  Cookies.remove('r');
  window.location.href = '/login';
};
