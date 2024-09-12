import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  placeholder: string;
  fetchData: () => Promise<any[]>;
  initialValue: string;
  onSearch: (value: string) => void;
  searchBarValue: string;
  setSearchBarValue: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  fetchData,
  initialValue,
  onSearch,
  searchBarValue,
  setSearchBarValue,
  onKeyDown
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchDataAsync = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchData();
    setData(result);
    setIsLoading(false);
  }, [fetchData]);

  useEffect(() => {
    fetchDataAsync();
  }, [fetchDataAsync]);

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
    setSearchBarValue(e.target.value.toUpperCase());
    setSelectedItem(e.target.value.toUpperCase());
    setIsDropdownOpen(true);
  };

  const handleItemClick = (item: any) => {
    const displayValue = `${item.nama.toUpperCase()} (${item.kode.toUpperCase()})`;
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
          className="p-3 pl-4 pr-10 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          onFocus={() => setIsDropdownOpen(true)}
          style={{ textTransform: 'uppercase' }}
          onKeyDown={onKeyDown}
        />
        {selectedItem && (
          <FaTimes
            className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
            onClick={clearInput}
          />
        )}
      </div>
      {isLoading && <div className="mt-2 text-sm text-gray-500">Loading...</div>}
      {isDropdownOpen && !isLoading && (
        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto w-full z-10 dark:bg-gray-800 dark:border-gray-700">
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
                className="p-3 cursor-pointer hover:bg-gray-100 transition duration-300 dark:hover:bg-gray-600 dark:text-gray-200"
                style={{ textTransform: 'uppercase' }}
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