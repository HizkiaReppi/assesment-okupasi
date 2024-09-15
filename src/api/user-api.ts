import { AxiosResponse } from 'axios';
import { apiClient, handleError } from './apiClient';

const authenticatedRequest = async (requestFunction: () => Promise<AxiosResponse>) => {
  try {
    const response = await requestFunction();
    console.log('Request headers:', response.config.headers);
    console.log('Response headers:', response.headers);
    return response.data;
  } catch (error) {
    console.error('Error in authenticated request:', error);
    throw handleError(error);
  }
};

export const getAllUsers = () => authenticatedRequest(() => apiClient.get('/user'));

export const createUser = (nama: string, email: string, password: string) => 
  authenticatedRequest(() => apiClient.post('/user', { nama, email, password }));

export const deleteUser = (id: string) => 
  authenticatedRequest(() => apiClient.delete(`/user/${id}`));

export const changeEmail = (email: string) => 
  authenticatedRequest(() => apiClient.patch('/user/email', { email }));

export const changePassword = (password: string) => 
  authenticatedRequest(() => apiClient.patch('/user/password', { password }));