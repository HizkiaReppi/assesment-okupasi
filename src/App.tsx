import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainMenu from './pages/MainMenu';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RedirectRoute from './routes/RedirectRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/login" element={<RedirectRoute element={<Login />} />} />
          <Route path="/signup" element={<ProtectedRoute element={<Signup />} />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
