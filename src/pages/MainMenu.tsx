import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import hoverImagePeta from '../assets/FullMap.png';
import ScrollingText from '../components/ScrollingText'; // Import the ScrollingText component

const MainMenu = () => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, section: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const handleClick = (path: string) => {
    navigate(path);
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

  const baseFontSize = 16;
  const goldenRatio = 1.618;

  const h1FontSize = baseFontSize * Math.pow(goldenRatio, 3);
  const pFontSize = baseFontSize;
  const buttonFontSize = baseFontSize * goldenRatio;

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900">
      <div className="fixed top-20 w-full z-10 bg-transparent">
        <ScrollingText /> 
      </div>
      <div
        className="w-full h-full flex flex-col justify-center items-center bg-white dark:bg-gray-700 relative overflow-hidden border-r border-gray-300 dark:border-gray-700"
        onMouseMove={(e) => handleMouseMove(e, 'peta')}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative z-10 text-center px-4 pb-2">
          <h1 className="font-bold text-gray-800 dark:text-gray-200" style={{ fontSize: `${h1FontSize}px`, marginBottom: `${baseFontSize * goldenRatio}px` }}>PETA OKUPASI</h1>
          <p className="mb-4 max-w-md text-gray-600 dark:text-gray-400" style={{ fontSize: `${pFontSize}px`, marginBottom: `${baseFontSize}px` }}>
            Temukan informasi terkait okupasi sekolah kejuruan yang ada di daerah <span className="font-bold">Sulawesi Utara</span>
          </p>
          <button
            onClick={() => handleClick('/form')}
            className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:bg-gray-900 hover:scale-105"
            style={{ fontSize: `${buttonFontSize}px` }}
          >
            Cari Okupasi
          </button>
        </div>
        {renderHoverImage('peta', hoverImagePeta)}
      </div>
    </div>
  );
};

export default MainMenu;
