import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // handle cookies
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

// Add sekolah
export const addSekolah = async (nama: string, kota: string) => {
  try {
    const response = await apiClient.post('/sekolah', { nama, kota }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Sekolah
export const getAllSekolah = async (search?: number, limit?: number, page?: number, kota?: string) => {
  try {
    const params: any = { search, limit, page };
    if (kota) {
      params.kota = kota;
    }
    const response = await apiClient.get('/sekolah', { params, withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get Sekolah By Id
export const getSekolahById = async (id: string) => {
  try {
    const response = await apiClient.get(`/sekolah/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Sekolah By Id
export const editSekolahById = async (id: string, nama: string, kota: string) => {
  try {
    const response = await apiClient.put(`/sekolah/${id}`, { nama, kota }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Sekolah By Id
export const deleteSekolahById = async (id: string) => {
  try {
    const response = await apiClient.delete(`/sekolah/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add Kompetensi
export const addKompetensi = async (id: string, kode: string, unit_kompetensi: { id: string }[]) => {
  try {
    const response = await apiClient.post(`/sekolah/${id}/kompetensi`, { kode, unit_kompetensi }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Kompetensi
export const getAllKompetensi = async (id: string, search?: string, limit?: number, page?: number) => {
  try {
    const response = await apiClient.get(`/sekolah/${id}/kompetensi`, { params: { search, limit, page }, withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Kompetensi
export const editKompetensi = async (id: string, kode: string, unit_kompetensi: { id: string }[]) => {
  try {
    const response = await apiClient.put(`/sekolah/${id}/kompetensi`, { kode, unit_kompetensi }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Kompetensi By Kode Okupasi atau Delete semua kompetensi
export const deleteKompetensiByKodeOkupasi = async (id: string, kode: string) => {
  try {
    const response = await apiClient.delete(`/sekolah/${id}/okupasi/${kode}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Kompetensi By Id atau delete satu kompetensi
export const deleteKompetensiById = async (id: string, idUnit: string) => {
  try {
    const response = await apiClient.delete(`/sekolah/${id}/kompetensi/unit/${idUnit}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Sekolah Stat By Kode Okupasi
export const getAllSekolahStatByKodeOkupasi = async (kode: string, search?: string, limit?: number, page?: number) => {
  try {
    const response = await apiClient.get(`/sekolah/stat/okupasi/${kode}`, { params: { search, limit, page }, withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
