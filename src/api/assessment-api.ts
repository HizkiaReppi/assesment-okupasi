import { apiClient, handleError } from './apiClient';

export interface Assessment {
  id: string;
  title: string;
  url: string;
}

interface AssessmentResponse {
  status: string;
  data?: {
    id: string;
  };
}

interface AssessmentListResponse {
  status: string;
  limit?: number;
  total_page?: number;
  total_result?: number;
  page?: number;
  data?: Assessment[];
}

export const assessmentApi = {
  add: async (data: { title: string; url: string }): Promise<string> => {
    try {
      const response = await apiClient.post<AssessmentResponse>(
        '/assessment',
        data,
      );
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data.id;
      }
      throw new Error('Failed to add Assessment');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getAll: async (
    limit?: number,
    page?: number,
  ): Promise<AssessmentListResponse> => {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (page) params.append('page', page.toString());

      const response = await apiClient.get<AssessmentListResponse>(
        '/assessment',
        { params },
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  edit: async (id: string, title: string, url: string): Promise<void> => {
    try {
      const response = await apiClient.put<AssessmentResponse>(
        `/assessment/${id}`,
        { title, url },
      );
      if (response.data.status !== 'success') {
        throw new Error('Failed to edit Assessment');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete<AssessmentResponse>(
        `/assessment/${id}`,
      );
      if (response.data.status !== 'success') {
        throw new Error('Failed to delete Assessment');
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};
