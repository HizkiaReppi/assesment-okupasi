import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import GoogleMapComponent from '../components/GoogleMapComponent';
import { useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

interface School {
  id:number;
  nama: string;
  kota: string;
}

const libraries: any[] = ['places'];

const HomePage: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<{ lat: number, lng: number, name: string } | null>(null);
  const [initialSchools, setInitialSchools] = useState<{ lat: number, lng: number, name: string }[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });

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
    const fetchInitialSchools = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/sekolah', {
          withCredentials: true,
        });
        if (response.data && Array.isArray(response.data.data)) {
          const schoolsWithCoords = await Promise.all(response.data.data.map(async (school: School) => {
            const address = `${school.nama}, ${school.kota}, Indonesia`;
            const coordinates = await geocodeAddress(address);
            return { id: school.id, lat: coordinates.lat, lng: coordinates.lng, name: school.nama };
          }));
          setInitialSchools(schoolsWithCoords);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching initial schools:', error);
      }
    };

    fetchInitialSchools();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col sm:flex-row h-screen overflow-hidden">
      <div className="flex-grow">
        <GoogleMapComponent
          lat={selectedSchool ? selectedSchool.lat : (initialSchools[0]?.lat || -6.200000)}
          lng={selectedSchool ? selectedSchool.lng : (initialSchools[0]?.lng || 106.816666)}
          selectedSchoolName={selectedSchool ? selectedSchool.name : ''}
          allSchools={initialSchools}
          zoom={selectedSchool ? 18 : 10}
        />
      </div>
      <Sidebar onSelectSchool={(coordinates) => setSelectedSchool(coordinates)} />
    </div>
  );
};

export default HomePage;


