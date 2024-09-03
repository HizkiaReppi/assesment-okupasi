import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { refreshToken, isUserSuper, forceLogout } from "../api/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedInState] = useState(() => {
    return !!sessionStorage.getItem("Authorization");
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(() =>
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
        console.log('Token berhasil diperbarui di AuthProvider');
        setIsSuperAdmin(isUserSuper());
      } catch (error) {
        forceLogout();
      }
    };

    const resetLogoutTimeout = () => {
      if (timeout) clearTimeout(timeout);
      console.log('Mengatur ulang timeout logout');
      timeout = setTimeout(() => {
        forceLogout();
      }, 15 * 60 * 1000); // 15 menit
    };

    if (isLoggedIn) {
      console.log('Mengatur handler untuk refresh token dan logout');
      interval = setInterval(refreshAuthToken, 14 * 60 * 1000); // Perbarui token setiap 14 menit
      resetLogoutTimeout(); // Atur timeout logout awal

      // Dengarkan aktivitas pengguna
      window.addEventListener('mousemove', resetLogoutTimeout);
      window.addEventListener('keydown', resetLogoutTimeout);

      // Lakukan refresh token 5 detik setelah login pertama kali
      setTimeout(refreshAuthToken, 5000);

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
