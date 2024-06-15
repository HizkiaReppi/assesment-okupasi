import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';import hoverImagePeta from '../assets/FullMap.png'; // Ganti dengan path gambar untuk Peta Okupasi
import hoverImageSekolah from '../assets/CariSekolah.jpg'; // Ganti dengan path gambar untuk Cari Sekolah
import hoverImageData from '../assets/programmer.jpg'; // Ganti dengan path gambar untuk Data

const MainMenu = () => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, section: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const handleClick = (path: string) => {
    if (isLoggedIn) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const renderHoverImage = (section: string, image: string) => {
    return (
      hoveredSection === section && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            clipPath: `circle(150px at ${hoverPosition.x}px ${hoverPosition.y}px)`,
            opacity: 0.8,
          }}
        ></div>
      )
    );
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div
        className="w-full sm:w-2/3 h-1/3 sm:h-full flex flex-col justify-center items-center bg-gray-300 relative overflow-hidden no-hover:hover mt-16 sm:mt-0"
        onMouseMove={(e) => handleMouseMove(e, 'peta')}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative z-10 text-center px-4 pb-2">
          <h1 className="text-4xl font-bold">PETA OKUPASI</h1>
          <p className="mt-4 mb-4 max-w-md">
            Temukan informasi terkait okupasi sekolah kejuruan yang ada di daerah Tondano dan Tomohon
          </p>
          <button
            onClick={() => handleClick('/home')}
            className="px-6 py-3 bg-orange-700 text-white text-lg font-semibold rounded-lg shadow-lg transform transition duration-300 hover:bg-orange-800 hover:scale-105"
          >
            Getting Started
          </button>
        </div>
        {renderHoverImage('peta', hoverImagePeta)}
      </div>
      <div
        className="w-full sm:w-1/6 h-1/3 sm:h-full flex flex-col justify-center items-center bg-[#B49494] relative overflow-hidden no-hover:hover"
        onMouseMove={(e) => handleMouseMove(e, 'sekolah')}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative z-10 text-center px-4">
          <button
            onClick={() => handleClick('/cari-sekolah')}
            className="text-4xl font-bold text-black hover:text-orange-500"
          >
            Cari Sekolah
          </button>
        </div>
        {renderHoverImage('sekolah', hoverImageSekolah)}
      </div>
      <div
        className="w-full sm:w-1/6 h-1/3 sm:h-full flex flex-col justify-center items-center bg-[#C0ADAD] relative overflow-hidden no-hover:hover"
        onMouseMove={(e) => handleMouseMove(e, 'data')}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative z-10 text-center px-4">
          <button
            onClick={() => handleClick('/cek-data')}
            className="text-4xl font-bold text-black hover:text-orange-500"
          >
            Data
          </button>
        </div>
        {renderHoverImage('data', hoverImageData)}
      </div>
    </div>
  );
};

export default MainMenu;


