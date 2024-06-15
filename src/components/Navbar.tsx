import { useState } from "react";
import "./Navbar.css";
import { FaDoorOpen, FaBars, FaDoorClosed } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="fixed w-full z-50 bg-gray-100 shadow-md"
      style={{ background: "#F8F8F8", color: "black" }}
    >
      <div className="navbar-container">
        <div className="logo-container">
          <img src="src/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="menu-container sm:flex hidden">
          <Link to="/" className="menu-button hover:text-orange-500">
            Home
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="menu-button flex items-center hover:text-orange-500"
            >
              <FaDoorClosed className="mr-2" /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="menu-button flex items-center hover:text-orange-500"
            >
              <FaDoorOpen className="mr-2" /> Login
            </Link>
          )}
        </div>

        <div className="hamburger sm:hidden flex" onClick={toggleMenu}>
          <FaBars />
        </div>
        {menuOpen && (
          <div className="menu-mobile sm:hidden">
            <Link
              to="/"
              className="menu-button hover:text-orange-500"
              onClick={toggleMenu}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="menu-button flex items-center hover:text-orange-500"
              >
                <FaDoorClosed className="mr-2" /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="menu-button flex items-center hover:text-orange-500"
                onClick={toggleMenu}
              >
                <FaDoorOpen className="mr-2" /> Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
