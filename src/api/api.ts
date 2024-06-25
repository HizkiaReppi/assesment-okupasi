import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.map(callback => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await apiClient.post('/user/refresh-token');
          const newToken = data.token;

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          onTokenRefreshed(newToken);
        } catch (refreshError) {
          console.error('Refresh token failed', refreshError);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      const retryOriginalRequest = new Promise(resolve => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw error.response ? error.response.data : new Error('An error occurred');
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/user/login', { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/user', { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (nama: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/user', { nama, email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (id: string, email: string, password: string) => {
  try {
    const emailResponse = await apiClient.patch('/user/email', { email });
    const passwordResponse = await apiClient.patch('/user/password', { password });
    return { emailResponse: emailResponse.data, passwordResponse: passwordResponse.data };
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`/user/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changeEmail = async (email: string) => {
  try {
    const response = await apiClient.patch('/user/email', { email }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (password: string) => {
  try {
    const response = await apiClient.patch('/user/password', { password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/user/logout', {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
