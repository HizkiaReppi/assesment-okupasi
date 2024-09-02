import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { getAllOkupasi } from '../api/okupasi-api';
import { useFormContext } from '../context/FormContext';
import { getAllSekolahStatByKodeOkupasi } from '../api/sekolah-api';
import hoverImagePeta from '../assets/bg2.webp'; // Import the hover image

const FormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setKodeOkupasi, setSchools, kodeOkupasi } = useFormContext();
  const [selectedKode, setSelectedKode] = useState<string>(kodeOkupasi || '');
  const navigate = useNavigate();

  // Hover state and handlers
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, section: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
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

  const handleSearch = async () => {
    if (!selectedKode) return;
    setIsLoading(true);
    try {
      const data = await getAllSekolahStatByKodeOkupasi(selectedKode);
      if (data.status === 'success') {
        setSchools(data.data);
        setKodeOkupasi(selectedKode);
        navigate('/home');
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOkupasi = async () => {
    const data = await getAllOkupasi();
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden"
      onMouseMove={(e) => handleMouseMove(e, 'form')}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-40 backdrop-filter backdrop-blur-lg p-8 sm:p-12 rounded-lg shadow-2xl w-full max-w-md border border-white border-opacity-30 dark:border-gray-700 relative z-10">
        <h2 className="text-2xl font-bold mb-10 text-gray-800 dark:text-gray-200 text-center">Cari Nama Okupasi</h2>
        <div className="space-y-6">
          <SearchBar 
            placeholder="Masukkan Nama Okupasi"
            fetchData={fetchOkupasi} 
            initialValue={kodeOkupasi} 
            onSearch={setSelectedKode}
            searchBarValue={selectedKode} 
            setSearchBarValue={setSelectedKode}
            onKeyDown={handleSearchEnter}
          />
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSearch}
              className={`w-full py-3 px-6 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Memuat...' : 'Search'}
            </button>
          </div>
          {isLoading && <p className="mt-4 text-center text-gray-500">Loading...</p>}
        </div>
      </div>
      {renderHoverImage('form', hoverImagePeta)}
    </div>
  );
};

export default FormPage;
