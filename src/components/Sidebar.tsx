import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter } from 'react-icons/fa';

interface School {
  id: string;
  nama: string;
  kota: string;
  lat: number;
  lng: number;
}

interface SidebarProps {
  onSelectSchool: (school: School) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectSchool }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

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
        const response = await axios.get('http://localhost:3000/api/v1/sekolah', {
          withCredentials: true,
        });
        if (response.data && Array.isArray(response.data.data)) {
          const schoolsWithCoords = await Promise.all(response.data.data.map(async (school: School) => {
            const address = `${school.nama}, ${school.kota}, Indonesia`;
            const coordinates = await geocodeAddress(address);
            return { ...school, ...coordinates };
          }));
          setSchools(schoolsWithCoords);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
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

  const handlePageChange = (direction: 'next' | 'prev') => {
    setCurrentPage((prevPage) => {
      if (direction === 'next') {
        return prevPage + 1;
      } else if (direction === 'prev') {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  const filteredSchools = schools
    .filter(school => school.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(school => (selectedFilter ? school.kota === selectedFilter : true));

  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

  const toggleFilterMenu = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
    setCurrentPage(1); // Reset to the first page when filter changes
  };

  return (
    <div className="flex">
      <div className={`fixed top-16 right-0 h-[calc(100%-4rem)] bg-white shadow-md z-50 ${isOpen ? 'w-80' : 'w-10'} transition-all duration-300`}>
        <button onClick={toggleSidebar} className="p-2 focus:outline-none">
          {isOpen ? '>' : '<'}
        </button>
        {isOpen && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 border rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={toggleFilterMenu} className="ml-2 p-2 border rounded">
                <FaFilter />
              </button>
              {isFilterOpen && (
                <div className="absolute top-12 right-4 bg-white shadow-md border rounded p-4">
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
            </div>
            <div className="mt-4 overflow-y-auto h-[calc(100vh-20rem)]">
              {paginatedSchools.length > 0 ? (
                paginatedSchools.map(school => (
                  <div key={school.id} className="p-2 border-b cursor-pointer" onClick={() => handleSchoolClick(school)}>
                    <h3 className="font-bold">{school.nama}</h3>
                    <p>{school.kota}</p>
                  </div>
                ))
              ) : (
                <p>No schools found.</p>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
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
