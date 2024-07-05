import { apiClient, handleError } from './apiClient';

// Add sekolah
export const addSekolah = async (
  nama: string,
  kota: string,
  jumlah_siswa: number,
  jumlah_kelulusan: number
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "/sekolah",
      { nama, kota, jumlah_siswa, jumlah_kelulusan },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get All Sekolah
export const getAllSekolah = async (
  search?: string,
  limit?: number,
  page?: number,
  kota?: string
) => {
  try {
    const params: any = { search, limit, page };
    if (kota) {
      params.kota = kota;
    }
    const response = await apiClient.get("/sekolah", {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get Sekolah By Id
export const getSekolahById = async (id: string) => {
  try {
    const response = await apiClient.get(`/sekolah/${id}`, {
      withCredentials: true,
    });
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
    const response = await apiClient.put(
      `/sekolah/${id}`,
      { nama, kota, jumlah_siswa, jumlah_kelulusan },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Sekolah By Id
export const deleteSekolahById = async (id: string) => {
  try {
    const response = await apiClient.delete(`/sekolah/${id}`, {
      withCredentials: true,
    });
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
    const response = await apiClient.post(
      `/sekolah/${id}/kompetensi`,
      { kode, unit_kompetensi },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllKompetensi = async (
  id: string,
  search = "",
  limit = 10,
  page = 1
) => {
  try {
    const response = await apiClient.get(`/sekolah/${id}/kompetensi`, {
      params: { search, limit, page },
      withCredentials: true,
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
    const response = await apiClient.put(
      `/sekolah/${id}/kompetensi`,
      { kode, unit_kompetensi },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Kompetensi By Kode Okupasi atau Delete semua kompetensi
export const deleteKompetensiByKodeOkupasi = async (
  id: string,
  kode: string
) => {
  try {
    const response = await apiClient.delete(
      `/sekolah/${id}/kompetensi/okupasi/${kode}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Delete Kompetensi By Id atau delete satu kompetensi
export const deleteKompetensiById = async (id: string, idUnit: string) => {
  try {
    const response = await apiClient.delete(
      `/sekolah/${id}/kompetensi/unit/${idUnit}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllSekolahStatByKodeOkupasi = async (
  kode: string,
  search?: string,
  limit?: number,
  page?: number
): Promise<any> => {
  try {
    const response = await apiClient.get(
      `/sekolah/stat/okupasi/${kode}`,
      {
        params: { search, limit, page },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
