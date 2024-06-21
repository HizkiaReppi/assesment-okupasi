import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/user/login', { email, password } , { withCredentials: true });
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

export const updateUser = async (id: string, nama?: string, email?: string, password?: string) => {
  try {
    const response = await apiClient.put(`/user/${id}`, { nama, email, password });
    return response.data;
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
    const response = await apiClient.post('/user/logout', { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
