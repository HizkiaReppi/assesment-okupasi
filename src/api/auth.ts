import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { apiClient, handleError } from './apiClient';

// Fungsi login
export const login = async (email: string, password: string) => {
  try {
    const response: AxiosResponse = await apiClient.post('/user/login', { email, password });
    const token = response.data.data.token; // Token dari respons body
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    console.log('Token received:', token);
    console.log('Token expiry:', decodedToken.exp);

    if (decodedToken.exp < currentTime) {
      console.log('Token sudah expired, melakukan refresh token...');
      await refreshToken();
    } else {
      // Token sudah valid, menyimpan di session storage
      setSessionToken(token, decodedToken.is_super);
    }

    // Mulai refresh token periodik
    startPeriodicRefresh();

    return { token, isSuperUser: decodedToken.is_super };
  } catch (error) {
    handleError(error);
  }
};

// Fungsi logout
export const logout = async () => {
  try {
    await apiClient.post('/user/logout');
    stopPeriodicRefresh();
    clearSession();
  } catch (error) {
    handleError(error);
  }
};

// Fungsi refresh token
export const refreshToken = async () => {
  try {
    console.log('Attempting to refresh token...');
    
    // Menggunakan withCredentials untuk memastikan cookies dikirim dengan permintaan
    const response: AxiosResponse = await apiClient.put('/authentication/refresh', {}, { withCredentials: true });

    if (response.data.status === 'success') {
      const token = response.data.data.token; // Ambil token dari respons body
      const decodedToken: any = jwtDecode(token);
      setSessionToken(token, decodedToken.is_super);
      return { token, isSuperUser: decodedToken.is_super }; // Mengembalikan token baru
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error: unknown) {
    console.error('Error refreshing token:', error instanceof Error ? error.message : String(error));
    forceLogout();
    throw error;
  }
};

// // Fungsi untuk memulai refresh token periodik
// export const startPeriodicRefresh = () => {
//   stopPeriodicRefresh(); // Hentikan interval yang mungkin sudah berjalan
//   const intervalId = setInterval(periodicRefreshToken, 60000); // 60000 ms = 1 minute
//   localStorage.setItem('refreshTokenIntervalId', intervalId.toString());
// };

// // Fungsi untuk menghentikan refresh token periodik
// export const stopPeriodicRefresh = () => {
//   const intervalId = localStorage.getItem('refreshTokenIntervalId');
//   if (intervalId) {
//     clearInterval(parseInt(intervalId));
//     localStorage.removeItem('refreshTokenIntervalId');
//   }
// };

// // Fungsi untuk melakukan refresh token secara periodik
// const periodicRefreshToken = async () => {
//   try {
//     await refreshToken();
//     console.log('Periodic token refresh successful');
//   } catch (error) {
//     console.error('Periodic token refresh failed:', error);
//     // Jangan force logout di sini, biarkan logika refresh token utama yang menanganinya
//   }
// };

// Fungsi force logout
export const forceLogout = async () => {
  stopPeriodicRefresh();
  clearSession();
  alert('Session has ended. Please log in again.');
};

// Fungsi untuk menghapus session storage
const clearSession = () => {
  // Hapus semua cookie terkait sesi
  document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  // Hapus dari sessionStorage jika perlu
  sessionStorage.removeItem('Authorization');
  sessionStorage.removeItem('isSuperUser');
  localStorage.removeItem('refreshTokenIntervalId');
  // Arahkan ke halaman login
  window.location.href = '/login';
};

// Fungsi untuk menyimpan token di session storage
const setSessionToken = (token: string, isSuperUser: boolean) => {
  sessionStorage.setItem('Authorization', token);
  sessionStorage.setItem('isSuperUser', isSuperUser ? 'true' : 'false');
};

// Fungsi untuk mengecek apakah user adalah super user
export const isUserSuper = (): boolean => {
  return sessionStorage.getItem('isSuperUser') === 'true';
};

// Fungsi untuk menunda eksekusi
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk memanggil refreshToken setiap 1 menit
const startPeriodicRefresh = () => {
  // Hentikan interval yang mungkin sudah berjalan
  stopPeriodicRefresh();
  
  // Mulai interval baru
  const intervalId = setInterval(async () => {
    try {
      await refreshToken();
      console.log('Periodic token refresh successful');
    } catch (error) {
      console.error('Periodic token refresh failed:', error);
    }
  }, 60000); // 60000 ms = 1 minute

  // Simpan ID interval di localStorage agar dapat dihapus nanti
  localStorage.setItem('refreshTokenIntervalId', intervalId.toString());
};

// Fungsi untuk menghentikan refresh token periodik
const stopPeriodicRefresh = () => {
  const intervalId = localStorage.getItem('refreshTokenIntervalId');
  if (intervalId) {
    clearInterval(parseInt(intervalId));
    localStorage.removeItem('refreshTokenIntervalId');
  }
};

// Fungsi untuk menginisialisasi auth state saat halaman dimuat
const initializeAuthState = async () => {
  const token = sessionStorage.getItem('Authorization');
  console.log('Initializing auth state, token found:', token);

  if (token) {
    try {
      // Tunggu 10 detik sebelum memanggil refreshToken
      await delay(10000);

      console.log('Attempting to refresh token after delay...');
      const response = await refreshToken();

      console.log('Token refreshed successfully:', response);

      // Jika berhasil, token lama di sessionStorage diganti dengan yang baru
      sessionStorage.setItem('Authorization', response.token);
      sessionStorage.setItem('isSuperUser', response.isSuperUser ? 'true' : 'false');

      // Mulai periodic refresh setelah inisialisasi
      startPeriodicRefresh();
    } catch (error) {
      console.error('Error during token initialization:', error);
      forceLogout(); // Paksa logout jika refresh token gagal
    }
  } else {
    console.log('No token found in session storage.');
  }
};

// Panggil initializeAuthState saat halaman dimuat
window.onload = initializeAuthState;
