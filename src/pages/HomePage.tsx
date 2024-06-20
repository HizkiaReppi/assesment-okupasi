import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import GoogleMapComponent from '../components/GoogleMapComponent';
import InfoBar from '../components/InfoBar';
import { useJsApiLoader } from '@react-google-maps/api';
import { getAllSekolah, getSekolahById, getAllKompetensi } from '../api/sekolah-api';

interface School {
  id: string;
  nama: string;
  kota: string;
  lat: number;
  lng: number;
}

interface Kompetensi {
  kode: string;
  nama: string;
  unit_kompetensi: {
    id: string;
    nama: string;
  }[];
}

const libraries: any[] = ['places'];

const HomePage: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<{ lat: number, lng: number, name: string, id: string } | null>(null);
  const [initialSchools, setInitialSchools] = useState<School[]>([]);
  const [kompetensi, setKompetensi] = useState<Kompetensi[]>([]);
  const [infoBarVisible, setInfoBarVisible] = useState<boolean>(false);
  const [center, setCenter] = useState<{ lat: number, lng: number }>({ lat: -6.200000, lng: 106.816666 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    const fetchInitialSchools = async () => {
      try {
        const response = await getAllSekolah();
        if (response && Array.isArray(response.data)) {
          const schoolsWithCoords = await Promise.all(response.data.map(async (school: School) => {
            const address = `${school.nama}, ${school.kota}, Indonesia`;
            const coordinates = await geocodeAddress(address);
            return { ...school, ...coordinates, name: school.nama }; // ensure 'name' is added
          }));

          setInitialSchools(schoolsWithCoords);

          // Calculate average coordinates
          if (schoolsWithCoords.length > 0) {
            const avgLat = schoolsWithCoords.reduce((sum, school) => sum + school.lat, 0) / schoolsWithCoords.length;
            const avgLng = schoolsWithCoords.reduce((sum, school) => sum + school.lng, 0) / schoolsWithCoords.length;
            setCenter({ lat: avgLat, lng: avgLng });
          }
        } else {
          console.error('Expected an array but got:', response);
        }
      } catch (error) {
        console.error('Error fetching initial schools:', error);
      }
    };

    fetchInitialSchools();
  }, []);

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

  const handleMarkerClick = async (school: School) => {
    try {
      const schoolData = await getSekolahById(school.id);
      if (schoolData && schoolData.data) {
        const { nama, lat, lng } = schoolData.data;
        setSelectedSchool({ id: school.id, name: nama, lat, lng });
        setCenter({ lat, lng }); // Move the map center to the marker

        const kompetensiData = await getAllKompetensi(school.id);
        setKompetensi(Array.isArray(kompetensiData.data) ? kompetensiData.data : []);

        setInfoBarVisible(true);
      }
    } catch (err) {
      console.error('Gagal mengambil data:', err);
      setKompetensi([]);
    }
  };

  const handleSidebarClick = (school: School) => {
    setSelectedSchool({ id: school.id, name: school.nama, lat: school.lat, lng: school.lng });
    setCenter({ lat: school.lat, lng: school.lng }); // Move the map center to the school from the sidebar
  };

  const handleCloseInfoBar = () => {
    setInfoBarVisible(false);
    setSelectedSchool(null);
    setKompetensi([]);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col sm:flex-row h-screen overflow-hidden">
      <div className="flex-grow">
        <GoogleMapComponent
          lat={center.lat}
          lng={center.lng}
          selectedSchool={selectedSchool}
          allSchools={initialSchools}
          zoom={12}  // set a fixed zoom level
          onMarkerClick={handleMarkerClick}
          setCenter={(lat, lng) => setCenter({ lat, lng })}
        />
      </div>
      <Sidebar onSelectSchool={handleSidebarClick} />
      {infoBarVisible && (
        <InfoBar school={selectedSchool} kompetensi={kompetensi} onClose={handleCloseInfoBar} />
      )}
    </div>
  );
};

export default HomePage;
