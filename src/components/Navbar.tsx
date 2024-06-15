// src/components/Navbar.tsx
import { useState } from 'react';
import './Navbar.css';
import { FaDoorOpen, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed w-full z-50 bg-gray-100 shadow-md" style={{ background: '#F8F8F8', color: 'black' }}>
      <div className="navbar-container">
        <div className="logo-container">
          <img src="src/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="menu-container sm:flex hidden">
          <Link to="/" className="menu-button hover:text-orange-500">Home</Link>
          <Link to="/login" className="menu-button flex items-center hover:text-orange-500">
            <FaDoorOpen className="mr-2" /> Login
          </Link>
        </div>
        <div className="hamburger sm:hidden flex" onClick={toggleMenu}>
          <FaBars />
        </div>
        {menuOpen && (
          <div className="menu-mobile sm:hidden">
            <Link to="/" className="menu-button hover:text-orange-500" onClick={toggleMenu}>Home</Link>
            <Link to="/login" className="menu-button flex items-center hover:text-orange-500" onClick={toggleMenu}>
              <FaDoorOpen className="mr-2" /> Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
