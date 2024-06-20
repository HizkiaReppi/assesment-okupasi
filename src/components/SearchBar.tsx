import React, { useState, useEffect, FormEvent } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { getAllOkupasi } from '../api/okupasi-api';

interface SearchBarProps {
  onSearch: (kode: string) => Promise<School[]>;
  onCloseResults: () => void; // Prop baru
}

interface School {
  id: string;
  nama: string;
  kota: string;
  lat: number;
  lng: number;
  kode: string;
}

interface Okupasi {
  kode: string;
  nama: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCloseResults }) => {
  const [kode, setKode] = useState('');
  const [results, setResults] = useState<School[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [okupasiList, setOkupasiList] = useState<Okupasi[]>([]);
  const [filteredOkupasi, setFilteredOkupasi] = useState<Okupasi[]>([]);

  useEffect(() => {
    const fetchOkupasi = async () => {
      const data = await getAllOkupasi();
      if (data && Array.isArray(data.data)) {
        setOkupasiList(data.data);
      }
    };
    fetchOkupasi();
  }, []);

  useEffect(() => {
    if (kode) {
      const filtered = okupasiList.filter((okupasi) =>
        okupasi.kode.includes(kode) || okupasi.nama.toLowerCase().includes(kode.toLowerCase())
      );
      setFilteredOkupasi(filtered);
    } else {
      setFilteredOkupasi([]);
    }
  }, [kode, okupasiList]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = await onSearch(kode);
    setResults(data);
    setIsExpanded(false); // Collapse after search
  };

  const handleIconClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleResultClick = (selectedKode: string) => {
    setKode(selectedKode);
    setFilteredOkupasi([]);
  };

  const handleCloseResults = () => {
    setResults([]);
    onCloseResults();
  };

  return (
    <div className="fixed top-16 z-50 bg-white shadow-md rounded-lg p-2 flex items-center">
      <button onClick={handleIconClick} className="p-2">
        <FaSearch size={24} />
      </button>
      {isExpanded && (
        <div className="relative">
          <form onSubmit={handleSubmit} className="flex items-center ml-2 space-x-2">
            <input
              type="text"
              placeholder="Masukkan Kode Okupasi"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              required
              className="border border-gray-500 p-2 rounded-lg focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="border border-black text-black p-2 rounded hover:bg-black hover:text-white focus:outline-none"
            >
              Cari
            </button>
          </form>
          {filteredOkupasi.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white p-2 rounded-lg shadow-md max-h-60 overflow-y-auto">
              <ul>
                {filteredOkupasi.map((okupasi) => (
                  <li
                    key={okupasi.kode}
                    onClick={() => handleResultClick(okupasi.kode)}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    {okupasi.kode} - {okupasi.nama}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {results.length > 0 && (
        <div className="absolute top-full left-0 w-80 mt-4 bg-white p-4 rounded-lg shadow-md max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-700">Hasil Pencarian</h2>
            <button onClick={handleCloseResults} className="text-red-500 hover:text-red-700">
              <FaTimes />
            </button>
          </div>
          <ul className="space-y-2">
            {results.map((result) => (
              <li key={result.id} className="p-2 border-b border-gray-300">
                <p className="font-medium">{result.nama}</p>
                <p className="text-gray-500">{result.kota}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
