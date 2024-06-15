import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainMenu from './pages/MainMenu';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import HomePage from './pages/HomePage';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Ganti dengan path ke ProtectedRoute

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
