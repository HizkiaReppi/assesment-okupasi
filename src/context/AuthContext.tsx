import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { refreshToken, isUserSuper } from "../api/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    return !!sessionStorage.getItem("Authorization"); 
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(() =>
    isUserSuper()
  );

  const setIsLoggedIn = (isLoggedIn: boolean) => {
    setIsLoggedInState(isLoggedIn);
    if (isLoggedIn) {
      setIsSuperAdmin(isUserSuper());
    } else {
      setIsSuperAdmin(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      setIsSuperAdmin(isUserSuper());
    }
  }, [isLoggedIn]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const refreshAuthToken = async () => {
      try {
        await refreshToken();
        setIsSuperAdmin(isUserSuper()); 
      } catch (error) {
        handleLogout();
      }
    };

    const handleLogout = () => {
      clearSession();
      alert('Sesi Anda telah kadaluarsa. Silakan login kembali.'); 
      setIsLoggedIn(false);
    };

    const resetLogoutTimeout = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout();
      }, 15 * 60 * 1000); // 15 menit
    };

    if (isLoggedIn) {
      interval = setInterval(refreshAuthToken, 15 * 60 * 1000); // Perbarui token setiap 15 menit
      resetLogoutTimeout(); // Atur timeout logout awal

      // Dengarkan aktivitas pengguna
      window.addEventListener('mousemove', resetLogoutTimeout);
      window.addEventListener('keydown', resetLogoutTimeout);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
        window.removeEventListener('mousemove', resetLogoutTimeout);
        window.removeEventListener('keydown', resetLogoutTimeout);
      };
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isSuperAdmin, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Fungsi untuk menghapus session storage
const clearSession = () => {
  sessionStorage.removeItem('Authorization');
  sessionStorage.removeItem('isSuperUser');
  // Hapus cookies authorization
  document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/login'; // Arahkan ke halaman login
};
