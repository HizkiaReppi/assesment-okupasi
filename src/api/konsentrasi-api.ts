import { apiClient, handleError } from './apiClient';

export interface Konsentrasi {
  id: string;
  nama: string;
  total_sekolah: number;
}

interface KonsentrasiResponse {
  status: string;
  data?: {
    kode: string;
  };
}

interface KonsentrasiListResponse {
  status: string;
  limit?: number;
  total_page?: number;
  total_result?: number;
  page?: number;
  data?: Konsentrasi[];
}

export const konsentrasiApi = {
  add: async (data: { sekolahId: string; nama: string }): Promise<string> => {
    try {
      const response = await apiClient.post<KonsentrasiResponse>(
        '/konsentrasi',
        data,
      );
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data.kode;
      }
      throw new Error('Failed to add konsentrasi');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getAll: async (
    search?: string,
    limit?: number,
    page?: number,
  ): Promise<KonsentrasiListResponse> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (limit) params.append('limit', limit.toString());
      if (page) params.append('page', page.toString());

      const response = await apiClient.get<KonsentrasiListResponse>(
        '/konsentrasi',
        { params },
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  edit: async (id: string, nama: string): Promise<void> => {
    try {
      const response = await apiClient.put<KonsentrasiResponse>(
        `/konsentrasi/${id}`,
        { nama },
      );
      if (response.data.status !== 'success') {
        throw new Error('Failed to edit konsentrasi');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete<KonsentrasiResponse>(
        `/konsentrasi/${id}`,
      );
      if (response.data.status !== 'success') {
        throw new Error('Failed to delete konsentrasi');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
