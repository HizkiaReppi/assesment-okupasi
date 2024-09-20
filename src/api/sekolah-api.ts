import { apiClient, handleError } from './apiClient';

// Add Sekolah
export const addSekolah = async (
  nama: string,
  kota: string,
  jumlah_siswa: number,
  jumlah_kelulusan: number,
  konsentrasi: { id: string }[]
): Promise<any> => {
  try {
    const response = await apiClient.post("/sekolah", {
      nama,
      kota,
      jumlah_siswa,
      jumlah_kelulusan,
      konsentrasi
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Sekolah
export const getAllSekolah = async (
  search?: string,
  limit?: number,
  page?: number
) => {
  try {
    const response = await apiClient.get("/sekolah", {
      params: { search, limit, page }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get Sekolah By Id
export const getSekolahById = async (id: string) => {
  try {
    const response = await apiClient.get(`/sekolah/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Sekolah By Id
export const editSekolahById = async (
  id: string,
  nama: string,
  kota: string,
  jumlah_siswa: number,
  jumlah_kelulusan: number
): Promise<any> => {
  try {
    const response = await apiClient.put(`/sekolah/${id}`, {
      nama,
      kota,
      jumlah_siswa,
      jumlah_kelulusan
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Sekolah By Id
export const deleteSekolahById = async (id: string) => {
  try {
    const response = await apiClient.delete(`/sekolah/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add Kompetensi
export const addKompetensi = async (
  id: string,
  kode: string,
  unit_kompetensi: { id: string }[]
) => {
  try {
    const response = await apiClient.post(`/sekolah/${id}/kompetensi`, {
      kode,
      unit_kompetensi
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Kompetensi
export const getAllKompetensi = async (
  id: string,
  search = "",
  limit = 1000,
  page = 1
) => {
  try {
    const response = await apiClient.get(`/sekolah/${id}/kompetensi`, {
      params: { search, limit, page }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Edit Kompetensi
export const editKompetensi = async (
  id: string,
  kode: string,
  unit_kompetensi: { id: string }[]
) => {
  try {
    const response = await apiClient.put(`/sekolah/${id}/kompetensi`, {
      kode,
      unit_kompetensi
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Kompetensi By Kode Okupasi
export const deleteKompetensiByKodeOkupasi = async (
  id: string,
  kode: string
) => {
  try {
    const response = await apiClient.delete(`/sekolah/${id}/kompetensi/okupasi/${kode}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Kompetensi By Id
export const deleteKompetensiById = async (id: string, idUnit: string) => {
  try {
    const response = await apiClient.delete(`/sekolah/${id}/kompetensi/unit/${idUnit}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Sekolah Stat By Kode Okupasi
export const getAllSekolahStatByKodeOkupasi = async (
  kode: string,
  search?: string,
  limit?: number,
  page?: number
): Promise<any> => {
  try {
    const response = await apiClient.get(`/sekolah/stat/okupasi/${kode}`, {
      params: { search, limit, page }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// update Konsentrasi to Sekolah
export const updateSekolahKonsentrasi = async (id: string, konsentrasiIds: string[]) => {
  try {
      const response = await apiClient.put(`/sekolah/${id}/konsentrasi`, {
          konsentrasi: konsentrasiIds.map(konsentrasiId => ({ id: konsentrasiId }))
      });
      return response.data;
  } catch (error) {
      handleError(error); 
  }
};