import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainMenu from './pages/MainMenu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import DataSekolahPage from './pages/DataSekolahPage';
import DataOkupasiPage from './pages/DataOkupasiPage'; 
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RedirectRoute from './routes/RedirectRoute';

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/login" element={<RedirectRoute element={<Login />} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} /> 
        <Route path="/data-sekolah" element={<ProtectedRoute element={<DataSekolahPage />} />} />
        <Route path="/data-okupasi" element={<DataOkupasiPage />} /> 
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
