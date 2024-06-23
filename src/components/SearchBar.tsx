import React, { useState, useEffect, useCallback } from 'react';
import Select, { components, StylesConfig } from 'react-select';
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

const customStyles: StylesConfig<any, false> = {
  control: (provided) => ({
    ...provided,
    borderColor: '#ccc',
    borderRadius: '8px',
    padding: '2px 8px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#aaa',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    maxHeight: '200px',
    borderRadius: '8px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#4a90e2' : state.isFocused ? '#d9e6f2' : 'white',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: state.isSelected ? '#4a90e2' : '#f0f4f7',
      color: state.isSelected ? 'white' : 'black',
    },
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search...", fetchData, initialValue, searchBarValue, setSearchBarValue }) => {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setKodeOkupasi, setSchools } = useFormContext();

  const loadOptions = useCallback(async () => {
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
  }, [fetchData, initialValue, setSearchBarValue]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleSearch = useCallback(async (selectedKode: string) => {
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
  }, [setSchools, setKodeOkupasi, onSearch]);

  const handleChange = (option: any) => {
    if (option && option.value !== searchBarValue) {
      setSearchBarValue(option.value);
      handleSearch(option.value);
    } else if (!option) {
      setSearchBarValue('');
      setSchools([]);
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
      styles={customStyles}
      menuPortalTarget={document.body}
    />
  );
};

export default SearchBar;
