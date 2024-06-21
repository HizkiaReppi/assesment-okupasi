import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

interface School {
  id: string;
  lat: number;
  lng: number;
  nama: string;
  kota: string;
}

interface Props {
  lat: number;
  lng: number;
  selectedSchool: { lat: number, lng: number, name: string } | null;
  filteredSchools: School[];
  zoom: number;
  onMarkerClick: (school: School) => void;
  setCenter: (lat: number, lng: number) => void;
}

const GoogleMapComponent: React.FC<Props> = ({ lat, lng, selectedSchool, filteredSchools, zoom, onMarkerClick, setCenter }) => {
  const [selectedSchoolInMap, setSelectedSchoolInMap] = useState<School | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);

  const handleMarkerClick = (school: School) => {
    setSelectedSchoolInMap(school);
    setInfoWindowOpen(true);
    onMarkerClick(school);
    setCenter(school.lat, school.lng); 
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={{ lat, lng }}
      zoom={zoom}
    >
      {filteredSchools.map((school) => (
        <Marker
          key={school.id}
          position={{ lat: school.lat, lng: school.lng }}
          onClick={() => handleMarkerClick(school)}
        />
      ))}
      {selectedSchoolInMap && infoWindowOpen && (
        <InfoWindow
          position={{ lat: selectedSchoolInMap.lat, lng: selectedSchoolInMap.lng }}
          onCloseClick={handleInfoWindowClose}
        >
          <div>
            <h2>{selectedSchoolInMap.nama}</h2>
            <p>{selectedSchoolInMap.kota}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
