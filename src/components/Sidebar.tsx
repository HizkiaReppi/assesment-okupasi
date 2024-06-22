import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import ReactPaginate from 'react-paginate';
import { getAllKompetensi, getAllSekolahStatByKodeOkupasi } from '../api/sekolah-api';
import { getAllOkupasi } from '../api/okupasi-api';
import { useFormContext } from '../context/FormContext';

interface Kompetensi {
  kode: string;
  nama: string;
  unit_kompetensi: {
    id: string;
    nama: string;
  }[];
}

interface School {
  id: string;
  nama: string;
  kota: string;
  lat: number;
  lng: number;
  kecocokan?: string;
  kompetensi?: Kompetensi[];
}

interface SidebarProps {
  onSelectSchool: (school: School) => void;
  onBackClick: () => void;
}

const Sidebar = ({ onSelectSchool, onBackClick }: SidebarProps) => {
  const { schools, setSchools, kodeOkupasi, setKodeOkupasi } = useFormContext();
  const [isOpen, setIsOpen] = useState(true);
  const [filteredSchools, setFilteredSchoolsState] = useState<School[]>([]);
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [schoolName, setSchoolName] = useState<string>('');

  useEffect(() => {
    setFilteredSchoolsState(schools);
  }, [schools]);

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_MAPS_API_KEY}`);
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  };

  const handleSchoolClick = (school: School) => {
    onSelectSchool(school);
  };

  const handleSearch = async (selectedKode: string) => {
    setIsSearching(true);
    try {
      const data = await getAllSekolahStatByKodeOkupasi(selectedKode);
      if (data.status === 'success' && data.data) {
        const result = await Promise.all(
          data.data.map(async (school: any) => {
            const address = `${school.nama}, ${school.kota}, Indonesia`;
            const coordinates = await geocodeAddress(address);
            const kompetensiData = await getAllKompetensi(school.id);
            return {
              id: school.id,
              nama: school.nama,
              kota: school.kota,
              lat: coordinates.lat,
              lng: coordinates.lng,
              kecocokan: parseFloat(school.kecocokan).toFixed(2),
              kompetensi: kompetensiData.data
            };
          })
        );

        result.sort((a, b) => parseFloat(b.kecocokan) - parseFloat(a.kecocokan));

        setSearchResults(result);
        setFilteredSchoolsState(result);
        setSchools(result);
        setKodeOkupasi(selectedKode);
        setCurrentPage(0);
      } else {
        setSearchResults([]);
        setFilteredSchoolsState([]);
        setSchools([]);
      }
    } catch (error) {
      console.error('Error fetching sekolah stat by kode okupasi:', error);
      setSearchResults([]);
      setFilteredSchoolsState([]);
      setSchools([]);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    if (kodeOkupasi) {
      handleSearch(kodeOkupasi);
    }
  }, [kodeOkupasi]);

  // Search school name
  const handleSearchSchool = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSchoolName(searchTerm);

    if (searchTerm === '') {
      setFilteredSchoolsState(schools);
      setSearchResults(schools);
    } else {
      const filtered = schools.filter(school =>
        school.nama.toLowerCase().includes(searchTerm)
      );
      setFilteredSchoolsState(filtered);
      setSearchResults(filtered);
    }
    setCurrentPage(0);
  };

  const clearSchoolNameSearch = () => {
    setSchoolName('');
    setFilteredSchoolsState(schools);
    setSearchResults(schools);
    setCurrentPage(0);
  };

  const handleFilterSelect = (filter: string | null) => {
    setSelectedFilter(filter);
    if (filter) {
      const filtered = schools.filter(school => school.kota.toLowerCase().includes(filter.toLowerCase()));
      setFilteredSchoolsState(filtered);
      setSearchResults(filtered);
    } else {
      setFilteredSchoolsState(schools);
      setSearchResults(schools);
    }
    setIsFilterOpen(false);
    setCurrentPage(0);
  };

  const handleClearFilter = () => {
    setSelectedFilter(null);
    setFilteredSchoolsState(schools);
    setSearchResults(schools);
    setCurrentPage(0);
  };

  const handleBackClick = () => {
    onBackClick();
    setFilteredSchoolsState([]);
    setSchools([]);
    setSearchResults([]);
    setCurrentPage(0);
    setIsSearching(false);
  };

  const paginatedSchools = filteredSchools.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCount = Math.ceil(filteredSchools.length / itemsPerPage);

  const fetchOkupasi = async () => {
    const data = await getAllOkupasi();
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  };

  return (
    <div className="flex rounded-sm">
      <div className={`fixed top-14 right-0 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden bg-white shadow-md z-50 ${isOpen ? 'w-80' : 'w-10'} transition-all duration-300 flex flex-col rounded-sm`}>
        <button onClick={() => setIsOpen(!isOpen)} className="flex ml-2 p-2 font-extrabold focus:outline-none">
          {isOpen ? '>' : '<'}
        </button>
        {isOpen && (
          <div className="p-4 flex-grow flex flex-col">
            <div className="flex items-center mb=4">
              <SearchBar
                placeholder="Masukkan Kode Okupasi"
                fetchData={fetchOkupasi}
                initialValue={kodeOkupasi}
                onSearch={setKodeOkupasi}
              />
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2 border rounded ml-2">
                <FaFilter />
              </button>
            </div>
            {isFilterOpen && (
              <div className="absolute top-16 right-4 bg-white shadow-md border rounded p-4 z-50">
                <h4 className="font-bold mb-2">Filter by Kota</h4>
                {Array.from(new Set(schools.map(school => school.kota))).map(kota => (
                  <div key={kota} className="mb-2">
                    <button
                      onClick={() => handleFilterSelect(kota)}
                      className={`p-2 border rounded w-full text-left ${selectedFilter === kota ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                    >
                      {kota}
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleClearFilter}
                  className={`p-2 border rounded w-full text-left ${selectedFilter === null ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                >
                  Clear Filter
                </button>
              </div>
            )}
            <button onClick={() => setShowSchoolSearch(!showSchoolSearch)} className="p-2 mt-4 border rounded w-full text-left bg-gray-200">
              {showSchoolSearch ? 'Tutup' : 'Cari Sekolah'}
            </button>
            {(searchResults.length > 0 || isSearching) && (
              <button onClick={handleBackClick} className="p-2 mt-2 border rounded w-full text-left bg-gray-200">
                Back
              </button>
            )}
            {showSchoolSearch && (
              <div className="mt-4">
                {/* Pencarian sekolah berdasarkan nama */}
                <div className="flex items-center mb-4 relative">
                  <input
                    type="text"
                    value={schoolName}
                    onChange={handleSearchSchool}
                    placeholder="Cari Nama Sekolah"
                    className="p-2 border rounded w-full"
                  />
                  {schoolName && (
                    <FaTimes
                      className="absolute right-2 cursor-pointer text-gray-500"
                      onClick={clearSchoolNameSearch}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="mt-4 overflow-y-auto flex-grow">
              {paginatedSchools.length > 0 ? (
                paginatedSchools.map(school => (
                  <div
                    key={school.id}
                    className="p-4 border-b cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSchoolClick(school)}
                  >
                    <h3 className="font-bold text-lg">{school.nama}</h3>
                    <p className="text-gray-600">{school.kota}</p>
                    {school.kecocokan && (
                      <p className="text-gray-500">Kecocokan: {school.kecocokan}%</p>
                    )}
                    {school.kompetensi && school.kompetensi.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p><strong>Okupasi:</strong> {school.kompetensi.map(k => k.nama).join(', ')}</p>
                        <p><strong>Unit Kompetensi:</strong></p>
                        <ul className="list-disc list-inside ml-4">
                          {school.kompetensi.flatMap(k => k.unit_kompetensi.map((uk: any) => (
                            <li key={uk.id}>{uk.nama}</li>
                          )))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No schools found.</p>
              )}
            </div>
            <div className="mt-4 mb-4">
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={({ selected }) => setCurrentPage(selected)}
                containerClassName={'pagination flex justify-center mt-4'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link p-2 border rounded mx-1'}
                previousLinkClassName={'page-link p-2 border rounded mx-1'}
                nextLinkClassName={'page-link p-2 border rounded mx-1'}
                breakLinkClassName={'page-link p-2 border rounded mx-1'}
                activeLinkClassName={'bg-gray-500 text-white'}
                disabledLinkClassName={'opacity-50 cursor-not-allowed'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
