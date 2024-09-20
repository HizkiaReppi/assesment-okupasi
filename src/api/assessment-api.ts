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
      throw new Error('Failed to add assessment');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getAll: async (): Promise<Assessment[]> => {
    try {
      const response = await apiClient.get<AssessmentListResponse>(
        '/assessment',
      );
      if (response.data.status === 'success' && response.data.data) {
        return response.data.data;
      }
      throw new Error('Failed to get assessments');
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  edit: async (
    id: string,
    data: { title: string; url: string },
  ): Promise<void> => {
    if (!id) {
      throw new Error('Assessment ID is required');
    }
    try {
      const response = await apiClient.put<AssessmentResponse>(
        `/assessment/${id}`,
        data,
      );
      if (response.data.status !== 'success') {
        throw new Error('Failed to edit assessment');
      }
    } catch (error) {
      console.error('Error in edit assessment:', error);
      handleError(error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!id) {
      throw new Error('Assessment ID is required');
    }
    try {
      const response = await apiClient.delete<AssessmentResponse>(
        `/assessment/${id}`,
      );
      if (response.data.status !== 'success') {
        throw new Error('Failed to delete assessment');
      }
    } catch (error) {
      console.error('Error in delete assessment:', error);
      handleError(error);
      throw error;
    }
  },
};
