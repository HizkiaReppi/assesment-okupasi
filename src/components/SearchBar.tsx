import React, { useState, useEffect, FormEvent } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { getAllOkupasi } from '../api/okupasi-api';

interface SearchBarProps {
  onSearch: (searchTerm: string) => Promise<void>;
  placeholder?: string;
}

interface Okupasi {
  kode: string;
  nama: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Masukkan Kode Okupasi" }) => {
  const [kode, setKode] = useState<string>('');
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
    await onSearch(kode);
  };

  const handleResultClick = (selectedKode: string) => {
    setKode(selectedKode);
    setFilteredOkupasi([]);
  };

  const handleClear = () => {
    setKode('');
    setFilteredOkupasi([]);
  };

  return (
    <div className="w-full p-2 flex items-center">
      <div className="relative w-full">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
          <input
            type="text"
            placeholder={placeholder}
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            required
            className="border border-gray-500 p-2 rounded-lg flex-grow focus:outline-none focus:border-black"
          />
          {kode && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 p-2 text-gray-500 hover:text-black focus:outline-none"
            >
              <FaTimes />
            </button>
          )}
          <button
            type="submit"
            className="border border-black text-black p-2 rounded hover:bg-black hover:text-white focus:outline-none"
          >
            <FaSearch />
          </button>
        </form>
        {filteredOkupasi.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white p-2 rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
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
    </div>
  );
};

export default SearchBar;
