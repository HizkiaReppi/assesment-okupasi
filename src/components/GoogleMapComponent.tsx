import React from 'react';
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
  onMarkerClick: (school: School) => void;
  setCenter: (lat: number, lng: number) => void;
}

const GoogleMapComponent: React.FC<Props> = ({ lat, lng, selectedSchool, allSchools, zoom, onMarkerClick, setCenter }) => {
  const [selectedSchoolInMap, setSelectedSchoolInMap] = React.useState<School | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = React.useState<boolean>(false);

  const handleMarkerClick = (school: School) => {
    setSelectedSchoolInMap(school);
    setInfoWindowOpen(true);
    onMarkerClick(school);
    setCenter(school.lat, school.lng); // Move the map center to the marker
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={{ lat, lng }}
      zoom={zoom}  // keep zoom constant
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
