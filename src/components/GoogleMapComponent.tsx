import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

interface Kompetensi {
  kode: string;
  nama: string;
  unit_kompetensi: {
    id: string;
    nama: string;
  }[];
}

interface School {
  id: string;
  lat: number;
  lng: number;
  nama: string;
  kota: string;
  kecocokan?: string;
  kompetensi?: Kompetensi[];
}

interface Props {
  lat: number;
  lng: number;
  zoom: number;
  filteredSchools: School[];
  onMarkerClick: (school: School) => void;
  selectedSchool: School | null;
}

const GoogleMapComponent: React.FC<Props> = ({
  lat,
  lng,
  zoom,
  filteredSchools,
  onMarkerClick,
  selectedSchool,
}) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);

  const handleMarkerClick = (school: School) => {
    onMarkerClick(school);
    setInfoWindowOpen(true);
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  const getMarkerIcon = (kecocokan: string | undefined) => {
    const percent = kecocokan ? parseFloat(kecocokan) : 0;
    if (percent > 75) {
      return {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new google.maps.Size(60, 60),
      };
    } else if (percent < 50) {
      return {
        url: 'https://maps.google.com/mapfiles/kml/paddle/wht-blank.png',
        scaledSize: new google.maps.Size(30, 30),
      };
    } else {
      return {
        url: 'https://maps.google.com/mapfiles/kml/paddle/wht-blank.png',
        scaledSize: new google.maps.Size(30, 30),
      };
    }
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
          icon={getMarkerIcon(school.kecocokan)}
        />
      ))}
      {selectedSchool && infoWindowOpen && (
        <InfoWindow
          position={{ lat: selectedSchool.lat, lng: selectedSchool.lng }}
          onCloseClick={handleInfoWindowClose}
        >
          <div className="max-w-xs max-h-48 overflow-y-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-lg font-bold mb-2 text-gray-900">{selectedSchool.nama}</h2>
            <p className="text-sm text-gray-800 mb-2">{selectedSchool.kota}</p>
            {selectedSchool.kecocokan && (
              <p className="text-sm text-gray-800 mb-2">
                <strong>Kecocokan:</strong> {selectedSchool.kecocokan}%
              </p>
            )}
            {selectedSchool.kompetensi && selectedSchool.kompetensi.length > 0 && (
              <div>
                <p className="text-sm text-gray-800 mb-1">
                  <strong>Okupasi:</strong> {selectedSchool.kompetensi.map(k => k.nama).join(', ')}
                </p>
                <p className="text-sm text-gray-800 mb-1">
                  <strong>Unit Kompetensi:</strong>
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-800">
                  {selectedSchool.kompetensi.flatMap(k => k.unit_kompetensi.map(uk => (
                    <li key={uk.id} className="mb-1">{uk.nama}</li>
                  )))}
                </ul>
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
