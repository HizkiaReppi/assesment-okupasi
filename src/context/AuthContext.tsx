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
    return !!sessionStorage.getItem("Authorization"); // Check if token exists in sessionStorage
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
        setIsSuperAdmin(isUserSuper()); // Update role after token is refreshed
      } catch (error) {
        const typedError = error as { response?: { data: any }, message: string };
        console.error('Failed to refresh token:', typedError.response ? typedError.response.data : typedError.message);
        handleLogout();
      }
    };

    const handleLogout = () => {
      clearSession();
      alert('Your session has expired. Please log in again.'); // Alert the user
      setIsLoggedIn(false);
    };

    if (isLoggedIn) {
      // Production code: Refresh token every 15 minutes, force logout after 15 minutes if no refresh
      const interval = setInterval(refreshAuthToken, 15 * 60 * 1000);

      timeout = setTimeout(() => {
        handleLogout();
      }, 15 * 60 * 1000);

      // Test code: Uncomment the following block for testing (1 minute intervals)
      
      // const interval = setInterval(refreshAuthToken, 1 * 60 * 1000);

      // timeout = setTimeout(() => {
      //   handleLogout();
      // }, 1 * 60 * 1000);
      

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
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
  window.location.href = '/login'; // Redirect to login page
};
