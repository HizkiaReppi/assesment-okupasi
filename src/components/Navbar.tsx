import { useState } from 'react';
import { FaDoorOpen, FaBars } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './Logout';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, isSuperAdmin } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getLinkClasses = (path: string) => {
    return location.pathname === path 
      ? "text-orange-700 border-b-2 border-orange-700 font-medium"
      : "text-gray-800 hover:text-orange-700 transition duration-300 font-medium";
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
          <Link to="/" className={getLinkClasses("/")}>Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/data-sekolah" className={getLinkClasses("/data-sekolah")}>Data Sekolah</Link>
              <Link to="/data-okupasi" className={getLinkClasses("/data-okupasi")}>Data Okupasi</Link>
              {isSuperAdmin && <Link to="/signup" className={getLinkClasses("/signup")}>User Settings</Link>}
              <LogoutButton />
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login" className={`text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center ${getLinkClasses("/login")}`}>
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
          <Link to="/" className={getLinkClasses("/")} onClick={toggleMenu}>Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/data-sekolah" className={getLinkClasses("/data-sekolah")} onClick={toggleMenu}>Data Sekolah</Link>
              <Link to="/data-okupasi" className={getLinkClasses("/data-okupasi")} onClick={toggleMenu}>Data Okupasi</Link>
              {isSuperAdmin && <Link to="/signup" className={getLinkClasses("/signup")} onClick={toggleMenu}>User Settings</Link>}
              <LogoutButton />
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login" className={`text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center ${getLinkClasses("/login")}`} onClick={toggleMenu}>
              <FaDoorOpen className="mr-2" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
