import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  placeholder: string;
  fetchData: () => Promise<any[]>;
  initialValue: string;
  onSearch: (value: string) => void;
  searchBarValue: string;
  setSearchBarValue: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  fetchData,
  initialValue,
  onSearch,
  searchBarValue,
  setSearchBarValue,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(initialValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData();
      setData(result);
    };
    fetchDataAsync();
  }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(e.target.value);
    setSelectedItem(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleItemClick = (item: any) => {
    const displayValue = `${item.nama} (${item.kode})`;
    setSelectedItem(displayValue);
    setSearchBarValue(displayValue);
    onSearch(item.kode);
    setIsDropdownOpen(false);
  };

  const clearInput = () => {
    setSelectedItem('');
    setSearchBarValue('');
    onSearch('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex items-center relative">
        <input
          type="text"
          placeholder={placeholder}
          value={selectedItem}
          onChange={handleInputChange}
          className="p-3 pl-4 pr-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          onFocus={() => setIsDropdownOpen(true)}
        />
        {selectedItem && (
          <FaTimes
            className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={clearInput}
          />
        )}
      </div>
      {isDropdownOpen && (
        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto w-full z-10">
          {data
            .filter(item => 
              item.nama.toLowerCase().includes(searchBarValue.toLowerCase()) ||
              item.kode.toLowerCase().includes(searchBarValue.toLowerCase())
            )
            .slice(0, 5)
            .map(item => (
              <div
                key={item.kode}
                onClick={() => handleItemClick(item)}
                className="p-3 cursor-pointer hover:bg-gray-100 transition duration-300"
              >
                {item.nama} ({item.kode})
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
