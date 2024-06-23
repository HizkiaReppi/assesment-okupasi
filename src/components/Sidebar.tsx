import { useState, useEffect, useRef } from "react";
import { FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import { useFormContext } from "../context/FormContext";
import { fetchSchoolsByOkupasi, fetchOkupasi } from "../hooks/sidebarApiHooks";

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
  setFilteredSchools: (schools: School[]) => void;
  schools: School[];
  onBackClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectSchool,
  setFilteredSchools,
  schools,
  onBackClick,
}) => {
  const { kodeOkupasi, setKodeOkupasi } = useFormContext();
  const [isOpen, setIsOpen] = useState(true);
  const [filteredSchools, setFilteredSchoolsState] = useState<School[]>([]);
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [filterPage, setFilterPage] = useState(0);
  const [okupasiName, setOkupasiName] = useState<string>("");

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredSchoolsState([]);
  }, [schools]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSchoolClick = (school: School) => {
    onSelectSchool(school);
    setSelectedSchool(school);
  };

  const handleSearch = async (selectedKode: string, searchQuery: string = "") => {
    setIsSearching(true);
    setFilteredSchoolsState([]);
    setFilteredSchools([]);
    try {
      const { result, selectedOkupasi } = await fetchSchoolsByOkupasi(selectedKode, searchQuery);

      setSearchResults(result);
      setFilteredSchoolsState(result);
      setFilteredSchools(result);
      setKodeOkupasi(selectedKode);
      setOkupasiName(selectedOkupasi ? selectedOkupasi.nama : "");
      setCurrentPage(1); // Reset pagination to first page
    } catch (error) {
      console.error("Error fetching sekolah stat by kode okupasi:", error);
      setSearchResults([]);
      setFilteredSchoolsState([]);
      setFilteredSchools([]);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    if (kodeOkupasi) {
      handleSearch(kodeOkupasi);
    }
  }, [kodeOkupasi]);

  const handleSearchSchool = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const executeSchoolSearch = () => {
    handleSearch(kodeOkupasi!, searchQuery);
  };

  const clearSchoolNameSearch = () => {
    setSearchQuery("");
    handleSearch(kodeOkupasi!);
  };

  const handleFilterSelect = (filter: string | null) => {
    setSelectedFilter(filter);
    if (filter) {
      const filtered = searchResults.filter((school) =>
        school.kota.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredSchoolsState(filtered);
      setFilteredSchools(filtered);
    } else {
      setFilteredSchoolsState(searchResults);
      setFilteredSchools(searchResults);
    }
    setFilterPage(0);
    setCurrentPage(1); // Reset pagination to first page
  };

  const handleClearFilter = () => {
    setSelectedFilter(null);
    setFilteredSchoolsState(searchResults);
    setFilteredSchools(searchResults);
    setFilterPage(0);
    setCurrentPage(1); // Reset pagination to first page
  };

  const handleBackClick = () => {
    onBackClick();
    setFilteredSchoolsState([]);
    setSearchResults([]);
    setSelectedSchool(null);
    setKodeOkupasi("");
    setSearchBarValue("");
    setCurrentPage(1);
    setIsSearching(false);
    setOkupasiName("");
    setShowSchoolSearch(false);
    setIsFilterOpen(false);
  };

  const handleToggleSchoolSearch = () => {
    if (showSchoolSearch) {
      setSearchQuery("");
      handleSearch(kodeOkupasi!);
    }
    setShowSchoolSearch(!showSchoolSearch);
  };

  const truncate = (str: string, n: number) => {
    return str.length > n ? str.substring(0, n) + "..." : str;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchools.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filteredKota = Array.from(new Set(searchResults.map((school) => school.kota)));
  const itemsPerFilterPage = 10;
  const paginatedKota = filteredKota.slice(
    filterPage * itemsPerFilterPage,
    (filterPage + 1) * itemsPerFilterPage
  );
  const filterPageCount = Math.ceil(filteredKota.length / itemsPerFilterPage);

  return (
    <div className="flex rounded-sm">
      <div
        className={`fixed top-14 right-0 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden bg-white shadow-md z-50 ${
          isOpen ? "w-80" : "w-10"
        } transition-all duration-300 flex flex-col rounded-sm`}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="flex ml-2 p-2 font-extrabold focus:outline-none">
          {isOpen ? ">" : "<"}
        </button>
        {isOpen && (
          <div className="p-4 flex-grow flex flex-col">
            {kodeOkupasi && (
              <h3 className="text-lg font-bold mb-4">
                Okupasi : {kodeOkupasi} - {okupasiName}
              </h3>
            )}
            <div className="flex items-center mb-4">
              {!isSearching && (
                <SearchBar
                  placeholder="Masukkan Kode Okupasi"
                  fetchData={fetchOkupasi}
                  initialValue={searchBarValue}
                  onSearch={setKodeOkupasi}
                  searchBarValue={searchBarValue}
                  setSearchBarValue={setSearchBarValue}
                />
              )}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 border rounded ml-2"
                disabled={!kodeOkupasi || isSearching}
              >
                <FaFilter />
              </button>
            </div>
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute top-14 right-14 bg-white shadow-md border rounded p-4 z-50 w-60"
              >
                <h4 className="font-bold mb-2">Filter by Kota</h4>
                <div className="max-h-40 overflow-y-auto">
                  {paginatedKota.map((kota) => (
                    <div key={kota} className="mb-2">
                      <button
                        onClick={() => handleFilterSelect(kota)}
                        className={`p-2 border rounded w-full text-left ${
                          selectedFilter === kota ? "bg-orange-500 text-white" : "bg-gray-200"
                        }`}
                      >
                        {kota}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleClearFilter}
                  className="p-2 border rounded w-full text-left bg-gray-200"
                >
                  Clear Filter
                </button>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setFilterPage(filterPage - 1)}
                    disabled={filterPage === 0}
                    className="p-2 border rounded bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilterPage(filterPage + 1)}
                    disabled={filterPage >= filterPageCount - 1}
                    className="p-2 border rounded bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {(searchResults.length > 0 || isSearching) && (
              <button
                onClick={handleBackClick}
                className="p-2 mt-2 border rounded-full w-full bg-gray-200 hover:bg-red-300 text-center"
              >
                Reset Pencarian
              </button>
            )}
            <button
              onClick={handleToggleSchoolSearch}
              className="p-2 mt-4 border rounded-full w-full text-center bg-gray-300  hover:bg-gray-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!kodeOkupasi || isSearching}
            >
              {showSchoolSearch ? "Tutup" : "Cari Sekolah"}
            </button>
            {showSchoolSearch && (
              <div className="mt-4 relative">
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchSchool}
                    placeholder="Cari Nama Sekolah"
                    className="p-2 border rounded w-full"
                  />
                  {searchQuery && (
                    <FaTimes
                      className="absolute right-12 cursor-pointer text-gray-500"
                      onClick={clearSchoolNameSearch}
                    />
                  )}
                  <button
                    onClick={executeSchoolSearch}
                    className="p-2 border rounded ml-2 bg-gray-200 hover:bg-gray-300 transition"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
            )}
            <div className="mt-4 overflow-y-auto flex-grow">
              {currentItems.length > 0 ? (
                currentItems.map((school) => (
                  <div
                    key={school.id}
                    className="p-4 border-b cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSchoolClick(school)}
                  >
                    <h3 className="font-bold text-lg">{truncate(school.nama, 20)}</h3>
                    <p className="text-gray-600">{truncate(school.kota, 20)}</p>
                    {school.kecocokan && (
                      <p className="text-gray-500">Kecocokan: {school.kecocokan}%</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No schools found.</p>
              )}
            </div>
            <div className="flex justify-center mt-4 mb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                  currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                    currentPage === index + 1 ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                  currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
