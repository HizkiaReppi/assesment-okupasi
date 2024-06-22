import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFormContext } from '../context/FormContext';
import { getAllSekolahStatByKodeOkupasi } from '../api/sekolah-api';

interface SearchBarProps {
  onSearch?: (kode: string) => void;
  placeholder?: string;
  fetchData: () => Promise<any[]>;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search...", fetchData, initialValue }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setKodeOkupasi, setSchools } = useFormContext();

  const loadOptions = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      if (Array.isArray(data)) {
        const sortedData = data.sort((a: any, b: any) => a.nama.localeCompare(b.nama));
        const formattedOptions = sortedData.map((item: any) => ({ value: item.kode, label: `${item.nama} - ${item.kode}` }));
        setOptions(formattedOptions);

        if (initialValue) {
          const initialOption = formattedOptions.find(option => option.value === initialValue);
          setSelectedOption(initialOption);
        }
      } else {
        console.error('Data fetched is not an array:', data);
      }
    } catch (error) {
      console.error('Error loading options:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOptions();
  }, [initialValue]);

  const handleSearch = async (selectedKode: string) => {
    setLoading(true);
    try {
      const data = await getAllSekolahStatByKodeOkupasi(selectedKode);
      if (data.status === 'success') {
        setSchools(data.data);
        setKodeOkupasi(selectedKode);
        if (onSearch) {
          onSearch(selectedKode);
        }
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleChange = (option: any) => {
    setSelectedOption(option);
    if (option) {
      handleSearch(option.value);
    }
  };

  const handleInputChange = (inputValue: string) => {
    if (inputValue === '') {
      loadOptions();
    } else {
      const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setOptions(filteredOptions);
    }
  };

  return (
    <Select
      isLoading={loading}
      options={options}
      onInputChange={handleInputChange}
      onChange={handleChange}
      onMenuOpen={loadOptions}
      placeholder={placeholder}
      value={selectedOption}
      className="w-full mb-2"
      styles={{
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
          maxHeight: '200px',
          overflowY: 'auto',
        }),
        control: (provided) => ({
          ...provided,
          borderColor: '#ccc',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'gray' : 'white',
          color: 'black',
          '&:hover': {
            backgroundColor: 'lightgray',
          },
        }),
      }}
    />
  );
};

export default SearchBar;
