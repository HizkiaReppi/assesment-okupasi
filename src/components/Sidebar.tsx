import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import ReactPaginate from 'react-paginate';
import { getAllSekolah, getAllKompetensi } from '../api/sekolah-api';
import { getOkupasiByKode } from '../api/okupasi-api';

interface School {
  id: string;
  nama: string;
  kota: string;
  lat: number;
  lng: number;
  kompetensi?: Kompetensi[];
}

interface Kompetensi {
  kode: string;
  nama: string;
  unit_kompetensi: {
    id: string;
    nama: string;
  }[];
}

interface SidebarProps {
  onSelectSchool: (school: School) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectSchool }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);

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

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await getAllSekolah();
        if (response && Array.isArray(response.data)) {
          const schoolsWithCoords = await Promise.all(response.data.map(async (school: School) => {
            const address = `${school.nama}, ${school.kota}, Indonesia`;
            const coordinates = await geocodeAddress(address);
            const kompetensiData = await getAllKompetensi(school.id); 
            return { ...school, ...coordinates, kompetensi: kompetensiData.data }; 
          }));

          setSchools(schoolsWithCoords);
          setFilteredSchools(schoolsWithCoords);
        } else {
          console.error('Expected an array but got:', response);
        }
      } catch (error) {
        console.error('Error fetching initial schools:', error);
      }
    };

    fetchSchools();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSchoolClick = (school: School) => {
    onSelectSchool(school);
  };

  const handleSearch = async (kode: string): Promise<void> => {
    try {
      const data = await getOkupasiByKode(kode);
      if (data && data.status === 'success' && data.data) {
        const filtered = schools.filter(school => 
          school.kompetensi && school.kompetensi.some(k => k.kode === data.data.kode)
        );
        setFilteredSchools(filtered);
        setCurrentPage(0); 
      } else {
        console.error('Expected an object but got:', data);
        setFilteredSchools([]);
      }
    } catch (error) {
      console.error('Error fetching okupasi by kode:', error);
      setFilteredSchools([]);
    }
  };

  const handleSearchSchool = async (schoolName: string): Promise<void> => {
    try {
      const filtered = schools.filter(school => 
        school.nama.toLowerCase().includes(schoolName.toLowerCase())
      );
      setFilteredSchools(filtered);
      setCurrentPage(0); 
    } catch (error) {
      console.error('Error searching school by name:', error);
      setFilteredSchools([]);
    }
  };

  const handleBack = () => {
    setFilteredSchools(schools);
    setCurrentPage(0);
  };

  const pageCount = Math.ceil(filteredSchools.length / itemsPerPage);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const paginatedSchools = filteredSchools.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
    setCurrentPage(0); 
  };

  const toggleSchoolSearch = () => {
    setShowSchoolSearch(!showSchoolSearch);
  };

  return (
    <div className="flex rounded-sm">
      <div className={`fixed top-14 right-0 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden bg-white shadow-md z-50 ${isOpen ? 'w-80' : 'w-10'} transition-all duration-300 flex flex-col rounded-sm`}>
        <button onClick={toggleSidebar} className="p-2 focus:outline-none">
          {isOpen ? '>' : '<'}
        </button>
        {isOpen && (
          <div className="p-4 flex-grow flex flex-col">
            <h1 className="text-2xl font-bold text-center font-sans">Cari Sekolah</h1>
            <div className="flex items-center ">
              <SearchBar onSearch={handleSearch} placeholder="Masukkan Kode Okupasi" />
              <button onClick={toggleFilterMenu} className="p-2 border rounded">
                <FaFilter />
              </button>
            </div>
            {isFilterOpen && (
              <div className="absolute top-12 right-4 bg-white shadow-md border rounded p-4 z-50">
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
                  onClick={() => handleFilterSelect('')}
                  className={`p-2 border rounded w-full text-left ${selectedFilter === '' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                >
                  Clear Filter
                </button>
              </div>
            )}
            <button onClick={toggleSchoolSearch} className="p-2 mt-4 border rounded w-full text-left bg-gray-200">
              {showSchoolSearch ? 'Tutup' : 'Cari Sekolah'}
            </button>
            {filteredSchools.length !== schools.length && (
              <button onClick={handleBack} className="p-2 mt-2 border rounded w-full text-left bg-gray-200">
                Back
              </button>
            )}
            {showSchoolSearch && (
              <div className="mt-4">
                <SearchBar onSearch={handleSearchSchool} placeholder="Cari Nama Sekolah" />
              </div>
            )}
            <div className="mt-4 overflow-y-auto flex-grow">
              {paginatedSchools.length > 0 ? (
                paginatedSchools.map(school => (
                  <div key={school.id} className="p-2 border-b cursor-pointer" onClick={() => handleSchoolClick(school)}>
                    <h3 className="font-bold">{school.nama}</h3>
                    <p>{school.kota}</p>
                    {school.kompetensi && school.kompetensi.length > 0 && (
                      <>
                        <p><strong>Okupasi:</strong> {school.kompetensi.map(k => k.nama).join(', ')}</p>
                        <p><strong>Unit Kompetensi:</strong> {school.kompetensi.flatMap(k => k.unit_kompetensi.map(uk => uk.nama)).join(', ')}</p>
                      </>
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
                onPageChange={handlePageClick}
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
