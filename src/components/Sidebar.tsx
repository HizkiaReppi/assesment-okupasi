import { useState, useEffect } from 'react';
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
  setFilteredSchools: (schools: School[]) => void;
  schools: School[];
}

const Sidebar = ({ onSelectSchool, setFilteredSchools, schools }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filteredSchools, setFilteredSchoolsState] = useState<School[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);

  useEffect(() => {
    setFilteredSchoolsState(schools);
  }, [schools]);

  const handleSchoolClick = (school: School) => {
    onSelectSchool(school);
  };

  const handleSearch = async (kode: string) => {
    try {
      const data = await getOkupasiByKode(kode);
      if (data.status === 'success' && data.data) {
        const filtered = schools.filter(school =>
          school.kompetensi && school.kompetensi.some(k => k.kode === data.data.kode)
        );
        setFilteredSchoolsState(filtered);
        setFilteredSchools(filtered);
        setCurrentPage(0);
      } else {
        setFilteredSchoolsState([]);
        setFilteredSchools([]);
      }
    } catch (error) {
      console.error('Error fetching okupasi by kode:', error);
      setFilteredSchoolsState([]);
      setFilteredSchools([]);
    }
  };

  const handleSearchSchool = async (schoolName: string) => {
    const filtered = schools.filter(school => 
      school.nama.toLowerCase().includes(schoolName.toLowerCase())
    );
    setFilteredSchoolsState(filtered);
    setFilteredSchools(filtered);
    setCurrentPage(0);
  };

  const handleFilterSelect = (filter: string | null) => {
    setSelectedFilter(filter);
    if (filter) {
      const filtered = schools.filter(school => school.kota === filter);
      setFilteredSchoolsState(filtered);
      setFilteredSchools(filtered);
    } else {
      setFilteredSchoolsState(schools);
      setFilteredSchools(schools);
    }
    setIsFilterOpen(false);
    setCurrentPage(0);
  };

  const handleBackClick = () => {
    setFilteredSchoolsState(schools);
    setFilteredSchools(schools);
    setCurrentPage(0);
  };

  const paginatedSchools = filteredSchools.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const pageCount = Math.ceil(filteredSchools.length / itemsPerPage);

  return (
    <div className="flex rounded-sm">
      <div className={`fixed top-14 right-0 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden bg-white shadow-md z-50 ${isOpen ? 'w-80' : 'w-10'} transition-all duration-300 flex flex-col rounded-sm`}>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 focus:outline-none">
          {isOpen ? '>' : '<'}
        </button>
        {isOpen && (
          <div className="p-4 flex-grow flex flex-col">
            <h1 className="text-2xl font-bold text-center font-sans mb-4">Cari Sekolah</h1>
            <div className="flex items-center mb-4">
              <SearchBar onSearch={handleSearch} placeholder="Masukkan Kode Okupasi" />
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
                  onClick={() => handleFilterSelect(null)}
                  className={`p-2 border rounded w-full text-left ${selectedFilter === null ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                >
                  Clear Filter
                </button>
              </div>
            )}
            <button onClick={() => setShowSchoolSearch(!showSchoolSearch)} className="p-2 mt-4 border rounded w-full text-left bg-gray-200">
              {showSchoolSearch ? 'Tutup' : 'Cari Sekolah'}
            </button>
            {filteredSchools.length !== schools.length && (
              <button onClick={handleBackClick} className="p-2 mt-2 border rounded w-full text-left bg-gray-200">
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
                  <div
                    key={school.id}
                    className="p-4 border-b cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSchoolClick(school)}
                  >
                    <h3 className="font-bold text-lg">{school.nama}</h3>
                    <p className="text-gray-600">{school.kota}</p>
                    {school.kompetensi && school.kompetensi.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p><strong>Okupasi:</strong> {school.kompetensi.map(k => k.nama).join(', ')}</p>
                        <p><strong>Unit Kompetensi:</strong></p>
                        <ul className="list-disc list-inside ml-4">
                          {school.kompetensi.flatMap(k => k.unit_kompetensi.map(uk => (
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
