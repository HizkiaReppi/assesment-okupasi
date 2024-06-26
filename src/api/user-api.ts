import { AxiosResponse } from 'axios';
import { apiClient, handleError } from './apiClient';

export const getAllUsers = async () => {
  try {
    const response: AxiosResponse = await apiClient.get('/user');
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
