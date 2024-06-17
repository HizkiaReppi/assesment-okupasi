import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // tangani cookies
});

// Handle Error
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw error.response ? error.response.data : new Error('An error occurred');
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

// Add Okupasi
export const createOkupasi = async (kode: string, nama: string, unitKompetensi: { nama: string }[]) => {
  try {
    const response = await apiClient.post('/okupasi', { kode, nama, unit_kompetensi: unitKompetensi });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Okupasi
export const getAllOkupasi = async () => {
  try {
    const response = await apiClient.get('/okupasi');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get Okupasi By Kode
export const getOkupasiByKode = async (kode: string) => {
  try {
    const response = await apiClient.get(`/okupasi/${kode}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Okupasi By Kode
export const updateOkupasi = async (kode: string, nama: string) => {
  try {
    const response = await apiClient.put(`/okupasi/${kode}`, { nama });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Okupasi By Kode
export const deleteOkupasi = async (kode: string) => {
  try {
    const response = await apiClient.delete(`/okupasi/${kode}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add Unit Kompetensi
export const addUnitKompetensi = async (kode: string, nama: string) => {
  try {
    const response = await apiClient.post(`/okupasi/${kode}/unit-kompetensi`, { nama });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Unit Kompetensi By Id
export const updateUnitKompetensi = async (kode: string, id: string, nama: string) => {
  try {
    const response = await apiClient.put(`/okupasi/${kode}/unit-kompetensi/${id}`, { nama });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Unit Kompetensi By Id
export const deleteUnitKompetensi = async (kode: string, id: string) => {
  try {
    const response = await apiClient.delete(`/okupasi/${kode}/unit-kompetensi/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
