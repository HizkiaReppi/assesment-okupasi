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
  selectedSchoolName?: string;
  allSchools: School[];
  zoom: number;
}

const GoogleMapComponent: React.FC<Props> = ({ lat, lng, selectedSchoolName, allSchools, zoom }) => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);

  const handleMarkerClick = (school: School) => {
    setSelectedSchool(school);
    setInfoWindowOpen(true);
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
      {allSchools.map((school) => (
        <Marker
          key={school.id}
          position={{ lat: school.lat, lng: school.lng }}
          onClick={() => handleMarkerClick(school)}
        />
      ))}
      {selectedSchool && infoWindowOpen && (
        <InfoWindow
          position={{ lat: selectedSchool.lat, lng: selectedSchool.lng }}
          onCloseClick={handleInfoWindowClose}
        >
          <div>
            <h2>{selectedSchoolName || selectedSchool.name}</h2>
            <p>tes</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
