import { useState, useEffect } from "react";
import "./Navbar.css";
import { FaDoorOpen, FaBars, FaDoorClosed } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Memeriksa status login dengan memanfaatkan middleware yang ada di backend
    axios.get('http://localhost:3000/api/v1/user', { withCredentials: true })
      .then(response => {
        // Jika respons berhasil, berarti pengguna sudah login dan mungkin super admin
        setIsLoggedIn(true);
        setIsSuperAdmin(true); // Asumsikan ini super admin jika permintaan berhasil
      })
      .catch(error => {
        // Jika respons gagal karena 403 Forbidden, berarti pengguna login tapi bukan super admin
        if (error.response && error.response.status === 403) {
          setIsLoggedIn(true);
          setIsSuperAdmin(false);
        } else {
          setIsLoggedIn(false);
        }
      });
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/user/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-gray-100 shadow-md" style={{ background: "#F8F8F8", color: "black" }}>
      <div className="navbar-container">
        <div className="logo-container">
          <img src="src/assets/logo.png" alt="Logo" className="logo" />
        </div>
        <div className="menu-container sm:flex hidden">
          <Link to="/" className="menu-button hover:text-orange-500">Home</Link>
          {isLoggedIn && isSuperAdmin && (
            <Link to="/add-member" className="menu-button hover:text-orange-500">Add Member</Link>
          )}
          {isLoggedIn ? (
            <button className="menu-button flex items-center hover:text-orange-500" onClick={handleLogout}>
              <FaDoorClosed className="mr-2" /> Logout
            </button>
          ) : (
            <Link to="/login" className="menu-button flex items-center hover:text-orange-500">
              <FaDoorOpen className="mr-2" /> Login
            </Link>
          )}
        </div>

        <div className="hamburger sm:hidden flex" onClick={toggleMenu}>
          <FaBars />
        </div>
        {menuOpen && (
          <div className="menu-mobile sm:hidden">
            <Link to="/" className="menu-button hover:text-orange-500" onClick={toggleMenu}>Home</Link>
            {isLoggedIn && isSuperAdmin && (
              <Link to="/add-member" className="menu-button hover:text-orange-500" onClick={toggleMenu}>Add Member</Link>
            )}
            {isLoggedIn ? (
              <button className="menu-button flex items-center hover:text-orange-500" onClick={handleLogout}>
                <FaDoorClosed className="mr-2" /> Logout
              </button>
            ) : (
              <Link to="/login" className="menu-button flex items-center hover:text-orange-500" onClick={toggleMenu}>
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
