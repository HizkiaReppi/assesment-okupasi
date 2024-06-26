import { useState} from 'react';
import { FaDoorOpen, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './Logout';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <Link to="/">
            <img src="src/assets/icon.png" alt="Logo" className="h-10" />
          </Link>
        </div>
        <div className="hidden sm:flex space-x-6">
          <Link to="/" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/data-sekolah" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">Data Sekolah</Link>
              <Link to="/data-okupasi" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">Data Okupasi</Link>
              <Link to="/signup" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium">User Settings</Link>
              <LogoutButton />
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
              <Link to="/signup" className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium" onClick={toggleMenu}>User Settings</Link>
              <LogoutButton />
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
