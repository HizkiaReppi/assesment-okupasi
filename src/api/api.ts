import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
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
    const response = await apiClient.post('/api/v1/user/login', { email, password });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/api/v1/user');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/v1/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (nama: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/v1/user', { nama, email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (id: string, nama?: string, email?: string, password?: string) => {
  try {
    const response = await apiClient.put(`/api/v1/user/${id}`, { nama, email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`/api/v1/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changeEmail = async (email: string) => {
  try {
    const response = await apiClient.patch('/api/v1/user/email', { email });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (password: string) => {
  try {
    const response = await apiClient.patch('/api/v1/user/password', { password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/api/v1/user/logout');
    localStorage.removeItem('authToken');
    authToken = null;
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
