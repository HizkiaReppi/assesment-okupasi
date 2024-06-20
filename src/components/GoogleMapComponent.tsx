import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

interface School {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface Props {
  lat: number;
  lng: number;
  selectedSchool: { lat: number, lng: number, name: string } | null;
  allSchools: School[];
  zoom: number;
}

const GoogleMapComponent: React.FC<Props> = ({ lat, lng, selectedSchool, allSchools, zoom }) => {
  const [selectedSchoolInMap, setSelectedSchoolInMap] = useState<School | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);

  const handleMarkerClick = (school: School) => {
    setSelectedSchoolInMap(school);
    setInfoWindowOpen(true);
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={{ lat, lng }}
      zoom={selectedSchool ? zoom : 12}  // setting zoom
    >
      {allSchools.map((school) => (
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
            <h2>{selectedSchoolInMap.name}</h2>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
