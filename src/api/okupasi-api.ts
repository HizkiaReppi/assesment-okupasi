import axios from 'axios';

// Gunakan variabel lingkungan untuk base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Pastikan cookies dikirim dengan setiap permintaan
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

export const getAllOkupasi = async () => {
  try {
    const response = await apiClient.get('/okupasi');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getOkupasiById = async (id: string) => {
  try {
    const response = await apiClient.get(`/okupasi/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createOkupasi = async (nama: string, deskripsi: string) => {
  try {
    const response = await apiClient.post('/okupasi', { nama, deskripsi });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateOkupasi = async (id: string, nama?: string, deskripsi?: string) => {
  try {
    const response = await apiClient.put(`/okupasi/${id}`, { nama, deskripsi });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteOkupasi = async (id: string) => {
  try {
    const response = await apiClient.delete(`/okupasi/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default {
  getAllOkupasi,
  getOkupasiById,
  createOkupasi,
  updateOkupasi,
  deleteOkupasi,
};
