import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { refreshToken, forceLogout, isUserSuper } from "../api/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    return !!sessionStorage.getItem("Authorization"); // Periksa apakah token ada di sessionStorage
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

    const refreshAuthToken = async () => {
      try {
        await refreshToken();
        setIsSuperAdmin(isUserSuper()); // Perbarui peran setelah token diperbarui
      } catch (error) {
        const typedError = error as { response?: { data: any }, message: string };
        console.error('Failed to refresh token:', typedError.response ? typedError.response.data : typedError.message);
        handleLogout();
      }
    };

    const handleLogout = () => {
      sessionStorage.removeItem("Authorization");
      sessionStorage.removeItem("isSuperUser");
      forceLogout();
      setIsLoggedIn(false);
    };

    if (isLoggedIn) {
      // Refresh token setiap 15 menit
      const interval = setInterval(refreshAuthToken, 15 * 60 * 1000);

      // Logout otomatis setelah 20 menit jika tidak ada refresh
      timeout = setTimeout(() => {
        handleLogout();
      }, 20 * 60 * 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    // // Commented out test code for 1 minute intervals and logout
    // if (isLoggedIn) {
    //   // Set interval to refresh token every 1 minute
    //   const interval = setInterval(refreshAuthToken, 1 * 60 * 1000);

    //   // Also set a timeout to logout after 1 minute if no refresh
    //   timeout = setTimeout(() => {
    //     forceLogout();
    //     setIsLoggedIn(false);
    //     sessionStorage.removeItem('isLoggedIn');
    //   }, 2 * 60 * 1000);

    //   return () => {
    //     clearInterval(interval);
    //     clearTimeout(timeout);
    //   };
    // }
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
