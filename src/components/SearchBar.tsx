import React, { useState, FormEvent } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (kode: string) => Promise<School[]>;
}

interface School {
  id: string;
  nama: string;
  kota: string;
  lat: number;
  lng: number;
  kode: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [kode, setKode] = useState('');
  const [results, setResults] = useState<School[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = await onSearch(kode);
    setResults(data);
    setIsExpanded(false); // Collapse after search
  };

  const handleIconClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed top-36 sm:top-16 right-90 z-50 bg-white shadow-md rounded-lg p-2 flex items-center">
      <button onClick={handleIconClick} className="p-2">
        <FaSearch size={24} />
      </button>
      {isExpanded && (
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
      )}
      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-700">Hasil Pencarian</h2>
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
