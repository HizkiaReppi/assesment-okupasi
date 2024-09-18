import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import SearchBar from "../SearchBar";
import { useFormContext } from "../../context/FormContext";
import {
  fetchSchoolsByOkupasi,
  fetchOkupasi,
} from "../../hooks/sidebarApiHooks";
import Loading from "../Loading2"; // Import the Loading component

interface Kompetensi {
  id: string;
  kode_unit: string;
  nama: string;
  standard_kompetensi: string;
}

interface Okupasi {
  kode: string;
  nama: string;
  unit_kompetensi: Kompetensi[];
}

interface Konsentrasi {
  kode: string;
  nama: string;
}

interface School {
  id: string;
  nama: string;
  kota: string;
  kecocokan: string;
  jumlah_siswa: number;
  jumlah_kelulusan: number;
  persentase_kelulusan: string;
  okupasi?: Okupasi;
  konsentrasi?: Konsentrasi[];
}

interface SidebarProps {
  onSelectSchool: (schoolName: string, schoolDetails: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectSchool }) => {
  const { kodeOkupasi, setKodeOkupasi } = useFormContext();
  const [isOpen, setIsOpen] = useState(true);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [, setSelectedSchool] = useState<School | null>(null);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [filterPage, setFilterPage] = useState(0);
  const [okupasiName, setOkupasiName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredSchools([]);
  }, []);

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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredSchools.length / itemsPerPage));
  }, [filteredSchools]);

  const handleSchoolClick = (school: School) => {
    const schoolDetails = {
      nama: school.nama,
      kota: school.kota,
      kecocokan: school.kecocokan,
      jumlah_siswa: school.jumlah_siswa,
      jumlah_kelulusan: school.jumlah_kelulusan,
      persentase_kelulusan: school.persentase_kelulusan,
      okupasi: school.okupasi?.nama,
      kode_okupasi: kodeOkupasi,
      unit_kompetensi: school.okupasi?.unit_kompetensi,
      konsentrasi: school.konsentrasi
    };
    onSelectSchool(school.nama, schoolDetails);
    setSelectedSchool(school);
  };

  const handleSearch = async (
    selectedKode: string,
    searchQuery: string = ""
  ) => {
    setIsSearching(true);
    setIsLoading(true);
    setFilteredSchools([]);
    try {
      const { result, selectedOkupasi } = await fetchSchoolsByOkupasi(
        selectedKode,
        searchQuery
      );

      setSearchResults(result);
      setFilteredSchools(result);
      setKodeOkupasi(selectedKode);
      setOkupasiName(selectedOkupasi ? selectedOkupasi.nama : "");
      setCurrentPage(1); // Reset pagination to first page
    } catch (error) {
      console.error("Error fetching sekolah stat by kode okupasi:", error);
      setSearchResults([]);
      setFilteredSchools([]);
    }
    setIsSearching(false);
    setIsLoading(false);
  };

  const executeOkupasiSearch = () => {
    if (kodeOkupasi) {
      handleSearch(kodeOkupasi);
    }
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeOkupasiSearch();
    }
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
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools(searchResults);
    }
    setFilterPage(0);
    setCurrentPage(1); // Reset pagination to first page
  };

  const handleClearFilter = () => {
    setSelectedFilter(null);
    setFilteredSchools(searchResults);
    setFilterPage(0);
    setCurrentPage(1); // Reset pagination to first page
  };

  const handleBackClick = () => {
    setFilteredSchools([]);
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

  const filteredKota = Array.from(
    new Set(searchResults.map((school) => school.kota))
  );
  const itemsPerFilterPage = 1000;
  const paginatedKota = filteredKota.slice(
    filterPage * itemsPerFilterPage,
    (filterPage + 1) * itemsPerFilterPage
  );
  const filterPageCount = Math.ceil(filteredKota.length / itemsPerFilterPage);

  const formatPercentage = (numerator: number, denominator: number): string => {
    if (denominator === 0) return "0%";
    return ((numerator / denominator) * 100).toFixed(2) + "%";
  };

  return (
    <div className="flex rounded-sm z-40">
      <div
        className={`fixed top-14 right-0 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden bg-white shadow-md z-50 ${
          isOpen ? "w-80" : "w-10"
        } transition-all duration-300 flex flex-col rounded-sm dark:bg-gray-800 dark:text-white`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex ml-2 p-2 font-extrabold focus:outline-none mt-4"
        >
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
                <>
                  <SearchBar
                    placeholder="Masukkan Nama Okupasi"
                    fetchData={fetchOkupasi}
                    initialValue={searchBarValue}
                    onSearch={setKodeOkupasi}
                    searchBarValue={searchBarValue}
                    setSearchBarValue={setSearchBarValue}
                    onKeyDown={handleSearchEnter}
                  />
                  <button
                    onClick={executeOkupasiSearch}
                    className="p-2 border rounded ml-2 bg-gray-200 hover:bg-gray-300 transition dark:bg-gray-600 dark:hover:bg-gray-700"
                  >
                    <FaSearch />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 border rounded ml-2 dark:bg-gray-600 dark:hover:bg-gray-700"
                disabled={!kodeOkupasi || isSearching}
              >
                <FaFilter />
              </button>
            </div>
            {isLoading ? (
              <div className="flex-grow flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <>
                {isFilterOpen && (
                  <div
                    ref={filterRef}
                    className="absolute top-14 right-14 bg-white shadow-md border rounded p-4 z-50 w-60 dark:bg-gray-700"
                  >
                    <h4 className="font-bold mb-2">Filter by Kota</h4>
                    <div className="max-h-40 overflow-y-auto">
                      {paginatedKota.map((kota) => (
                        <div key={kota} className="mb-2">
                          <button
                            onClick={() => handleFilterSelect(kota)}
                            className={`p-2 border rounded w-full text-left ${
                              selectedFilter === kota
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 dark:bg-gray-600 dark:text-white"
                            }`}
                          >
                            {kota}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleClearFilter}
                      className="p-2 border rounded w-full text-left bg-gray-200 dark:bg-gray-600 dark:text-white"
                    >
                      Clear Filter
                    </button>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => setFilterPage(filterPage - 1)}
                        disabled={filterPage === 0}
                        className="p-2 border rounded bg-gray-200 hover:bg-gray-300 transition dark:bg-gray-600 dark:hover:bg-gray-700"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setFilterPage(filterPage + 1)}
                        disabled={filterPage >= filterPageCount - 1}
                        className="p-2 border rounded bg-gray-200 hover:bg-gray-300 transition dark:bg-gray-600 dark:hover:bg-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                {(searchResults.length > 0 || isSearching) && (
                  <button
                    onClick={handleBackClick}
                    className="p-2 mt-2 border rounded-full w-full bg-gray-200 hover:bg-red-300 text-center dark:bg-gray-600 dark:hover:bg-red-400"
                  >
                    Reset Pencarian
                  </button>
                )}
                <button
                  onClick={handleToggleSchoolSearch}
                  className="p-2 mt-4 border rounded-full w-full text-center bg-gray-300 hover:bg-gray-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed dark:bg-gray-600 dark:hover:bg-gray-700"
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
                        className="p-2 border rounded w-full dark:bg-gray-600 dark:text-white"
                      />
                      {searchQuery && (
                        <FaTimes
                          className="absolute right-12 cursor-pointer text-gray-500 dark:text-white"
                          onClick={clearSchoolNameSearch}
                        />
                      )}
                      <button
                        onClick={executeSchoolSearch}
                        className="p-2 border rounded ml-2 bg-gray-200 hover:bg-gray-300 transition dark:bg-gray-600 dark:hover:bg-gray-700"
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
                        className="p-4 border-b cursor-pointer hover:bg-gray-100 transition dark:hover:bg-gray-700"
                        onClick={() => handleSchoolClick(school)}
                      >
                        <h3 className="font-bold text-lg dark:text-white">
                          {truncate(school.nama, 20)}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {truncate(school.kota, 20)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-300">
                          <strong>Kecocokan: {school.kecocokan}%</strong>
                        </p>
                        <p className="text-gray-500 dark:text-gray-300">
                          <strong>Jumlah Siswa: {school.jumlah_siswa}</strong>
                        </p>
                        <p className="text-gray-500 dark:text-gray-300">
                          <strong>
                            Jumlah Kelulusan: {school.jumlah_kelulusan}
                          </strong>{" "}
                          <strong>
                            (
                            {formatPercentage(
                              school.jumlah_kelulusan,
                              school.jumlah_siswa
                            )}
                            )
                          </strong>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No schools found.</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4 mb-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 dark:bg-gray-600 dark:text-gray-400"
                        : "bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 dark:bg-gray-600 dark:text-gray-400"
                        : "bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    }`}
                  >
                    Next
                  </button>
                </div>{" "}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
