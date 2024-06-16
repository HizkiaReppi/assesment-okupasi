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

export const addSekolah = async (nama: string, kota: string) => {
  try {
    const response = await apiClient.post('/api/v1/sekolah', { nama, kota });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllSekolah = async (search?: number, limit?: number, page?: number) => {
  try {
    const response = await apiClient.get('/api/v1/sekolah', { params: { search, limit, page } });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getSekolahById = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/v1/sekolah/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editSekolahById = async (id: string, nama: string, kota: string) => {
  try {
    const response = await apiClient.put(`/api/v1/sekolah/${id}`, { nama, kota });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteSekolahById = async (id: string) => {
  try {
    const response = await apiClient.delete(`/api/v1/sekolah/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const addKompetensi = async (id: string, kode: string, unit_kompetensi: { id: string }[]) => {
  try {
    const response = await apiClient.post(`/api/v1/sekolah/${id}/kompetensi`, { kode, unit_kompetensi });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllKompetensi = async (id: string, search?: string, limit?: number, page?: number) => {
  try {
    const response = await apiClient.get(`/api/v1/sekolah/${id}/kompetensi`, { params: { search, limit, page } });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editKompetensi = async (id: string, kode: string, unit_kompetensi: { id: string }[]) => {
  try {
    const response = await apiClient.put(`/api/v1/sekolah/${id}/kompetensi`, { kode, unit_kompetensi });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteKompetensiByKodeOkupasi = async (id: string, kode: string) => {
  try {
    const response = await apiClient.delete(`/api/v1/sekolah/${id}/okupasi/${kode}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteKompetensiById = async (id: string, idKompetensi: string) => {
  try {
    const response = await apiClient.delete(`/api/v1/sekolah/${id}/kompetensi/${idKompetensi}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllSekolahStatByKodeOkupasi = async (kode: string, search?: string, limit?: number, page?: number) => {
  try {
    const response = await apiClient.get(`/api/v1/sekolah/stat/okupasi/${kode}`, { params: { search, limit, page } });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
