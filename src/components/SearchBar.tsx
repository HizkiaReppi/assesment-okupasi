import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { useFormContext } from '../context/FormContext';
import { getAllSekolahStatByKodeOkupasi } from '../api/sekolah-api';

interface SearchBarProps {
  onSearch?: (kode: string) => void;
  placeholder?: string;
  fetchData: () => Promise<any[]>;
  initialValue?: string;
  searchBarValue: string;
  setSearchBarValue: (value: string) => void;
}

const MenuList = (props: any) => {
  return (
    <components.MenuList {...props}>
      <div
        onWheel={(e) => {
          e.stopPropagation();
        }}
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        {props.children}
      </div>
    </components.MenuList>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search...", fetchData, initialValue, searchBarValue, setSearchBarValue }) => {
  const [options, setOptions] = useState<any[]>([]);
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
          setSearchBarValue(initialOption ? initialOption.value : '');
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
    setSearchBarValue(option ? option.value : '');
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
      value={options.find(option => option.value === searchBarValue) || null}
      className="w-full mb-2"
      components={{ MenuList }}
      styles={{
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
          maxHeight: '200px',
        }),
        control: (provided) => ({
          ...provided,
          borderColor: '#ccc',
          zIndex: 9999,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'gray' : 'white',
          color: 'black',
          '&:hover': {
            backgroundColor: 'lightgray',
          },
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 }),
      }}
      menuPortalTarget={document.body}
    />
  );
};

export default SearchBar;
