import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

interface Kompetensi {
  id: string;
  nama: string;
}

interface Konsentrasi {
  id: string;
  nama: string;
}

interface Okupasi {
  kode: string;
  nama: string;
  unit_kompetensi: Kompetensi[];
}

interface School {
  id: string;
  lat: number;
  lng: number;
  nama: string;
  kota: string;
  kecocokan?: string;
  okupasi?: Okupasi;
  konsentrasi?: Konsentrasi[];
}

interface Props {
  filteredSchools: School[];
  onMarkerClick: (school: School | null) => void;
  selectedSchool: School | null;
}

const GoogleMapComponent: React.FC<Props> = ({
  filteredSchools,
  onMarkerClick,
  selectedSchool,
}) => {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 1.483818,
    lng: 124.845726,
  }); // Default to North Sulawesi
  const [zoom, setZoom] = useState<number>(10);

  useEffect(() => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedSchool) {
      setCenter({ lat: selectedSchool.lat, lng: selectedSchool.lng });
      setZoom(15);
    }
  }, [selectedSchool]);

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

  const bounds = {
    north: 4.834726, // North boundary of North Sulawesi
    south: 0.226033, // South boundary of North Sulawesi
    east: 127.797571, // East boundary of North Sulawesi
    west: 122.932839, // West boundary of North Sulawesi
  };

  useEffect(() => {
    if (selectedSchool) {
      console.log('Selected school data for InfoWindow:', selectedSchool);
    }
  }, [selectedSchool]);

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={zoom}
      options={{
        mapId: '890b9267e97ad716', // Adding mapId here
        restriction: {
          latLngBounds: bounds,
          strictBounds: true,
        },
      }}
    >
      {filteredSchools.map((school: School) => (
        <Marker
          key={school.id}
          position={{ lat: school.lat, lng: school.lng }}
          onClick={() => onMarkerClick(school)}
          icon={getMarkerIcon(school.kecocokan)}
        />
      ))}
      {selectedSchool && (
        <InfoWindow
          key={selectedSchool.id}
          position={{ lat: selectedSchool.lat, lng: selectedSchool.lng }}
          onCloseClick={() => onMarkerClick(null)}
          onLoad={(infoWindow) => {
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }
            infoWindowRef.current = infoWindow;
          }}
        >
          <div className='max-w-xs max-h-48 overflow-y-auto p-4 bg-white shadow-lg rounded-lg'>
            <h2 className='text-lg font-bold mb-2 text-gray-900'>
              {selectedSchool.nama}
            </h2>
            <p className='text-sm text-gray-800 mb-2'>{selectedSchool.kota}</p>
            {selectedSchool.kecocokan && (
              <p className='text-sm text-gray-800 mb-2'>
                <strong>Kecocokan:</strong> {selectedSchool.kecocokan}%
              </p>
            )}
            {selectedSchool.konsentrasi &&
            selectedSchool.konsentrasi.length > 0 ? (
              <>
                <p className='text-sm text-gray-800 mb-1'>
                  <strong>
                    Konsentrasi:{' '}
                    {selectedSchool.konsentrasi.length < 2
                      ? selectedSchool.konsentrasi[0]?.nama
                      : ''}
                  </strong>
                </p>
                <ul className='list-disc pl-5 text-sm text-gray-800'>
                  {selectedSchool.konsentrasi.map((k: Konsentrasi) => (
                    <li
                      key={k.id}
                      className='mb-1'
                    >
                      {k.nama}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className='text-sm text-gray-800 mb-1'>-</p>
            )}
            {selectedSchool.okupasi ? (
              <>
                <p className='text-sm text-gray-800 mb-1'>
                  <strong>Kode Okupasi:</strong> {selectedSchool.okupasi.kode}
                </p>
                <p className='text-sm text-gray-800 mb-1'>
                  <strong>Nama Okupasi:</strong> {selectedSchool.okupasi.nama}
                </p>
                {selectedSchool.okupasi.unit_kompetensi &&
                selectedSchool.okupasi.unit_kompetensi.length > 0 ? (
                  <>
                    <p className='text-sm text-gray-800 mb-1'>
                      <strong>Unit Kompetensi:</strong>
                    </p>
                    <ul className='list-disc pl-5 text-sm text-gray-800'>
                      {selectedSchool.okupasi.unit_kompetensi.map(
                        (uk: Kompetensi) => (
                          <li
                            key={uk.id}
                            className='mb-1'
                          >
                            {uk.nama}
                          </li>
                        ),
                      )}
                    </ul>
                  </>
                ) : (
                  <p className='text-sm text-gray-800 mb-1'>-</p>
                )}
              </>
            ) : (
              <p className='text-sm text-gray-800 mb-1'>-</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
