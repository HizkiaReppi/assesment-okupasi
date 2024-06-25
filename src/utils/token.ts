import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { AxiosInstance } from 'axios'; // Import AxiosInstance

// Utility function to check token expiration
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode(token);
    return exp ? exp < Date.now() / 1000 : true;
  } catch (e) {
    console.error('Error decoding token', e);
    return true;
  }
};

// Utility function to refresh token
export const refreshToken = async (apiClient: AxiosInstance) => { // Specify the type of apiClient
  try {
    const response = await apiClient.post('/user/refresh-token');
    const newToken = response.data.token;
    Cookies.set('token', newToken, { httpOnly: true }); // Set the new token as an HTTP-only cookie
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  } catch (error) {
    console.error('Failed to refresh token', error);
    Cookies.remove('token'); // Clear the cookie
    window.location.href = '/login'; // Redirect to login
  }
};
