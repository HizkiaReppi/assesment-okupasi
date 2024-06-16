import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface School {
  id: string;
  nama: string;
  kota: string;
  alamat: string; // Tambahkan alamat lengkap ke interface School
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<{ lat: number, lon: number } | null>(null);

  // Fungsi geocodeAddress untuk mengonversi alamat ke koordinat
  const geocodeAddress = async (address: string) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    throw new Error('Address not found');
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/sekolah', {
          withCredentials: true,
        });
        console.log('API Response:', response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setSchools(response.data.data);
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

  const handleSchoolClick = async (school: School) => {
    try {
      const address = `${school.nama}, Sarongsong II, Kec. Airmadidi, Kabupaten Minahasa Utara, Sulawesi Utara, 95371, Indonesia`; // Tambahkan detail lebih lengkap
      const coordinates = await geocodeAddress(address);
      setSelectedSchool(coordinates);
    } catch (error) {
      console.error('Geocoding failed:', error);
      alert('Lokasi tidak ditemukan. Coba dengan alamat yang lebih spesifik.');
    }
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
              <button className="ml-2">
                <FaFilter />
              </button>
            </div>
            <div className="mt-4">
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
      <div className="flex-1">
        <MapContainer center={[-1.656, 120.216]} zoom={5} className="h-screen w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedSchool && (
            <Marker position={[selectedSchool.lat, selectedSchool.lon]}>
              <Popup>
                Lokasi sekolah yang dipilih.
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Sidebar;
