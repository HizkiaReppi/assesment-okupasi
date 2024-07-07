import { useState, useEffect, useRef } from 'react';
import { FaDoorOpen, FaBars, FaCaretDown } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './Logout';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1080);
  const { isLoggedIn, isSuperAdmin } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getLinkClasses = (path: string) => {
    return location.pathname === path 
      ? "text-orange-700 border-b-2 border-orange-700 font-medium"
      : "text-gray-800 hover:text-orange-700 transition duration-300 font-medium";
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1080);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <Link to="/">
            <img src="src/assets/icon.png" alt="Logo" className="h-10" />
          </Link>
        </div>
        {isMobile ? (
          <div className="flex" onClick={toggleMenu}>
            <FaBars className="text-gray-800 hover:text-orange-700 transition duration-300" />
          </div>
        ) : (
          <div className="flex space-x-6">
            <Link to="/" className={getLinkClasses("/")}>Home</Link>
            {isLoggedIn && (
              <>
                <Link to="/data-sekolah" className={getLinkClasses("/data-sekolah")}>Data Sekolah</Link>
                <Link to="/data-okupasi" className={getLinkClasses("/data-okupasi")}>Data Okupasi</Link>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center">
                    Assessment <FaCaretDown className="ml-1" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLSc0TleUB6HGjj2bSmqmOphFgvXPMFM-WTU3HGGhFXd6gWugyQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Desain Komunikasi Visual (DKV)</a>
                      <a href="https://docs.google.com/forms/d/e/1FAIpQLScGgTdXSjmMheZjhyXQBYr_WDX8p8zqHBt20BqcdpwJyH-HXA/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Teknik Komputer dan Jaringan (TKJ)</a>
                    </div>
                  )}
                </div>
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
        )}
      </div>
      {isMobile && menuOpen && (
        <div className="bg-white w-full absolute top-16 left-0 right-0 shadow-md z-10 flex flex-col items-center space-y-4 py-4">
          <Link to="/" className={getLinkClasses("/")} onClick={toggleMenu}>Home</Link>
          {isLoggedIn && (
            <>
              <Link to="/data-sekolah" className={getLinkClasses("/data-sekolah")} onClick={toggleMenu}>Data Sekolah</Link>
              <Link to="/data-okupasi" className={getLinkClasses("/data-okupasi")} onClick={toggleMenu}>Data Okupasi</Link>
              <div className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center">
                  Assessment <FaCaretDown className="ml-1" />
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSc0TleUB6HGjj2bSmqmOphFgvXPMFM-WTU3HGGhFXd6gWugyQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={toggleMenu}>Desain Komunikasi Visual (DKV)</a>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScGgTdXSjmMheZjhyXQBYr_WDX8p8zqHBt20BqcdpwJyH-HXA/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={toggleMenu}>Teknik Komputer dan Jaringan (TKJ)</a>
                  </div>
                )}
              </div>
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
