import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SearchBar from '../components/SearchBar';
import { getAllOkupasi } from '../api/okupasi-api';
import { useFormContext } from '../context/FormContext';
import { getAllSekolahStatByKodeOkupasi } from '../api/sekolah-api';

const FormPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setKodeOkupasi, setSchools, kodeOkupasi } = useFormContext();
  const [selectedKode, setSelectedKode] = useState<string>(kodeOkupasi || '');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async () => {
    if (!selectedKode) return;
    setIsLoading(true);
    try {
      const data = await getAllSekolahStatByKodeOkupasi(selectedKode);
      if (data.status === 'success') {
        setSchools(data.data);
        setKodeOkupasi(selectedKode);
        navigate('/home'); // Navigate to /home after successful search
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  const fetchOkupasi = async () => {
    const data = await getAllOkupasi();
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Cari Kode Okupasi</h1>
      <div className="w-full max-w-md">
        <SearchBar 
          placeholder="Masukkan Kode Okupasi"
          fetchData={fetchOkupasi} 
          initialValue={kodeOkupasi} 
          onSearch={setSelectedKode}
        />
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="w-1/3 py-2 px-4 mt-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-lg shadow-md hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-75"
          >
            Search
          </button>
        </div>
        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default FormPage;
