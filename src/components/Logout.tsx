import { useNavigate } from 'react-router-dom';
import { FaDoorClosed } from 'react-icons/fa';
import { logout } from '../api/api';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
      alert('Session has ended. Please log in again.');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  };

  return (
    <button className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center" onClick={handleLogout}>
      <FaDoorClosed className="mr-2" /> Logout
    </button>
  );
};

export default LogoutButton;
