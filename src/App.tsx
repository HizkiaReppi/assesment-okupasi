import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import MainMenu from './pages/MainMenu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RedirectRoute from './routes/RedirectRoute';

const AppContent = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isLoggedIn) {
      timeout = setTimeout(() => {
        setIsLoggedIn(false);
        navigate('/login');
      }, 3600000); 
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoggedIn, setIsLoggedIn, navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<RedirectRoute element={<Login />} />} />
        <Route path="/signup" element={<ProtectedRoute element={<Signup />} />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
