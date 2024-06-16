import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Jangan ubah interface ini!
interface School {
  id: string;
  nama: string;
  kota: string;
  lat: number;  // Tambahkan ini
  lng: number;  // Tambahkan ini
}

interface SidebarProps {
  onSelectSchool: (coordinates: { lat: number, lng: number, name: string } | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectSchool }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    onSelectSchool({ lat: school.lat, lng: school.lng, name: school.nama });
  };

  const filteredSchools = schools.filter(school =>
    school.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            </div>
            <div className="mt-4 overflow-y-auto h-64"> {/* Tambahkan scroll */}
              {filteredSchools.length > 0 ? (
                filteredSchools.map(school => (
                  <div key={school.id} className="p-2 border-b cursor-pointer" onClick={() => handleSchoolClick(school)}>
                    <h3 className="font-bold">{school.nama}</h3>
                    <p>{school.kota}</p>
                  </div>
                ))
              ) : (
                <p>No schools found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
