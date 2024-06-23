import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Sudah termasuk '/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL, // Tidak perlu menambahkan '/api/v1' lagi
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // tangani cookies
});

// Handle Error
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('Axios error:', error.response?.data);
    if (error.response && error.response.data && error.response.data.errors) {
      throw new Error(error.response.data.errors[0].message);
    } else {
      throw error.response ? error.response.data : new Error('An error occurred');
    }
  } else if (error instanceof Error) {
    console.error('General error:', error.message);
    throw new Error(error.message);
  } else {
    console.error('Unknown error:', error);
    throw new Error('An unknown error occurred');
  }
};

// Add Okupasi
export const addOkupasi = async (kode: string, nama: string, unitKompetensi: { nama: string }[]) => {
  try {
    const payload = { kode, nama, unit_kompetensi: unitKompetensi };
    console.log('Sending data to server:', payload);
    const response = await apiClient.post('/okupasi', payload);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Okupasi
export const getAllOkupasi = async (search = '', limit = 10, page = 1) => {
  try {
    const response = await apiClient.get('/okupasi', {
      params: {
        search,
        limit,
        page,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get Okupasi By Kode
export const getOkupasiByKode = async (kode: string) => {
  try {
    const response = await apiClient.get(`/okupasi/${kode}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Okupasi By Kode
export const updateOkupasi = async (kode: string, newKode: string, nama: string) => {
  try {
    const response = await apiClient.put(`/okupasi/${kode}`, { kode: newKode, nama }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


// Delete Okupasi By Kode
export const deleteOkupasi = async (kode: string) => {
  try {
    const response = await apiClient.delete(`/okupasi/${kode}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add Unit Kompetensi
export const addUnitKompetensi = async (kode: string, nama: string) => {
  try {
    const response = await apiClient.post(`/okupasi/${kode}/unit-kompetensi`, { nama }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Unit Kompetensi By Id
export const updateUnitKompetensi = async (kode: string, id: string, nama: string) => {
  try {
    const response = await apiClient.put(`/okupasi/${kode}/unit-kompetensi/${id}`, { nama }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Unit Kompetensi By Id
export const deleteUnitKompetensi = async (kode: string, id: string) => {
  try {
    const response = await apiClient.delete(`/okupasi/${kode}/unit-kompetensi/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
