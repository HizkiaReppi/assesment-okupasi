import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { refreshToken, forceLogout } from '../api/auth';
import Cookies from 'js-cookie';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  const setIsLoggedIn = (isLoggedIn: boolean) => {
    setIsLoggedInState(isLoggedIn);
    if (isLoggedIn) {
      sessionStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('isLoggedIn');
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const refreshAuthToken = async () => {
      try {
        await refreshToken();
      } catch (error) {
        forceLogout();
        Cookies.remove('Authorization');
        Cookies.remove('r');
        setIsLoggedIn(false);
        sessionStorage.removeItem('isLoggedIn');
      }
    };

    if (isLoggedIn) {
      // Set interval to refresh token every 15 minutes
      const interval = setInterval(refreshAuthToken, 15 * 60 * 1000);

      // Also set a timeout to logout after 20 minutes if no refresh
      timeout = setTimeout(() => {
        forceLogout();
        setIsLoggedIn(false);
        sessionStorage.removeItem('isLoggedIn');
      }, 20 * 60 * 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    // Commented out test code for 1 minute intervals and logout
    // if (isLoggedIn) {
    //   // Set interval to refresh token every 1 minute
    //   const interval = setInterval(refreshAuthToken, 1 * 60 * 1000);

    //   // Also set a timeout to logout after 1 minute if no refresh
    //   timeout = setTimeout(() => {
    //     forceLogout();
    //     setIsLoggedIn(false);
    //     sessionStorage.removeItem('isLoggedIn');
    //   }, 1 * 60 * 1000);

    //   return () => {
    //     clearInterval(interval);
    //     clearTimeout(timeout);
    //   };
    // }

  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
