import { useState, useEffect } from "react";
import { FaDoorOpen, FaBars, FaDoorClosed } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { logout } from '../api/api';  

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth(); 

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:3000/api/v1/user', { withCredentials: true })
        .then(_ => {
          setIsSuperAdmin(true); 
        })
        .catch(error => {
          if (error.response && error.response.status === 403) {
            setIsSuperAdmin(false);
          }
        });
    } else {
      setIsSuperAdmin(false);
    }
  }, [isLoggedIn]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout(); 
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn'); 
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <img src="src/assets/icon.png" alt="Logo" className="h-10" />
        </div>
        <div className="hidden sm:flex space-x-6">
          <Link to="/" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/data-sekolah" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">Data Sekolah</Link>
              <Link to="/data-okupasi" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">Data Okupasi</Link>
              {isSuperAdmin && (
                <Link to="/signup" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">User Settings</Link>
              )}
              <button className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center" onClick={handleLogout}>
                <FaDoorClosed className="mr-2" /> Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center">
              <FaDoorOpen className="mr-2" /> Login
            </Link>
          )}
        </div>
        <div className="sm:hidden flex" onClick={toggleMenu}>
          <FaBars className="text-gray-800 hover:text-orange-700 transition duration-300"/>
        </div>
      </div>
      {menuOpen && (
        <div className="bg-white w-full absolute top-16 left-0 right-0 shadow-md z-10 flex flex-col items-center space-y-4 py-4">
          <Link to="/" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium" onClick={toggleMenu}>Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/data-sekolah" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium" onClick={toggleMenu}>Data Sekolah</Link>
              <Link to="/data-okupasi" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium" onClick={toggleMenu}>Data Okupasi</Link>
              {isSuperAdmin && (
                <Link to="/signup" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium" onClick={toggleMenu}>Add User</Link>
              )}
              <button className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center" onClick={handleLogout}>
                <FaDoorClosed className="mr-2" /> Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center" onClick={toggleMenu}>
              <FaDoorOpen className="mr-2" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
