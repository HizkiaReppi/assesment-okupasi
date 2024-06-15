// src/api/userApi.ts
import axiosInstance from './axiosConfig';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post('/user/login', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/user/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tambahkan fungsi lainnya sesuai kebutuhan
