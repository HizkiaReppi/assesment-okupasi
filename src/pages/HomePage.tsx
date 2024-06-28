import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllSekolah } from '../api/sekolah-api';
import L from 'leaflet';
import debounce from 'lodash.debounce';

interface School {
  id: string;
  nama: string;
  kota: string;
  lat?: number;
  lng?: number;
}

interface Kompetensi {
  id: string;
  nama: string;
}

interface PopupInfo {
  name: string;
  position: L.LatLng;
  details: {
    nama: string;
    kota: string;
    kecocokan?: string;
    okupasi?: string;
    kode_okupasi?: string;
    unit_kompetensi?: Kompetensi[];
  };
}

const HomePage: React.FC = () => {
  const [initialSchools, setInitialSchools] = useState<School[]>([]);
  const [center, setCenter] = useState<{ lat: number, lng: number }>({ lat: 1.3017, lng: 124.9113 }); // Koordinat Tondano
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [markers, setMarkers] = useState<L.LatLng[]>([]);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState<boolean>(false);

  const bounds = {
    north: 4.834726,
    south: 0.226033,
    east: 127.797571,
    west: 122.932839,
  };

  useEffect(() => {
    const fetchInitialSchools = async () => {
      try {
        const response = await getAllSekolah();
        if (response && Array.isArray(response.data)) {
          const schoolsWithCoords = response.data.filter((school: School) => school.lat !== undefined && school.lng !== undefined);
          setInitialSchools(schoolsWithCoords);
          if (schoolsWithCoords.length > 0) {
            const avgLat = schoolsWithCoords.reduce((sum: number, school: School) => sum + (school.lat ?? 0), 0) / schoolsWithCoords.length;
            const avgLng = schoolsWithCoords.reduce((sum: number, school: School) => sum + (school.lng ?? 0), 0) / schoolsWithCoords.length;
            setCenter({ lat: avgLat, lng: avgLng });
          }
        } else {
          console.error('Expected an array but got:', response);
        }
      } catch (error) {
        console.error('Error fetching initial schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSchools();
  }, []);

  const fetchGeocode = async (schoolName: string, schoolDetails: any) => {
    setIsLoadingLocation(true); // Mulai loading
    try {
      const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${import.meta.env.VITE_LOCATION_IQ_API_KEY}&q=${schoolName}&format=json`);
      if (response.status === 429) {
        setRateLimitExceeded(true);
        setIsLoadingLocation(false); // Selesai loading
        return;
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const position = new L.LatLng(lat, lon);
        setMarkers([position]);
        setPopupInfo({
          name: schoolName,
          position,
          details: {
            nama: schoolDetails.nama,
            kota: schoolDetails.kota,
            kecocokan: schoolDetails.kecocokan,
            okupasi: schoolDetails.okupasi,
            kode_okupasi: schoolDetails.kode_okupasi, // Include kodeOkupasi here
            unit_kompetensi: schoolDetails.unit_kompetensi || [], 
          }
        });
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setRateLimitExceeded(false);
      }
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    } finally {
      setIsLoadingLocation(false); 
    }
  };

  const debouncedFetchGeocode = useCallback(debounce(fetchGeocode, 1000), []);

  const handleSchoolClick = (schoolName: string, schoolDetails: any) => {
    debouncedFetchGeocode(schoolName, schoolDetails);
  };

  const MapBoundsSetter = () => {
    const map = useMap();

    useEffect(() => {
      map.setMaxBounds([
        [bounds.south, bounds.west],
        [bounds.north, bounds.east],
      ]);
      map.on('zoomend', () => {
        if (map.getZoom() < map.getMinZoom()) {
          map.setZoom(map.getMinZoom());
        }
      });
    }, [map]);

    useEffect(() => {
      if (markers.length > 0) {
        map.setView(markers[0], map.getZoom());
      }
    }, [markers, map]);

    return null;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="relative flex flex-col sm:flex-row h-screen overflow-hidden">
      {isLoadingLocation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-lg font-semibold">Mencari lokasi...</p>
          </div>
        </div>
      )}
      <div className="flex-grow h-full" style={{ zIndex: 0, paddingTop: '64px' }}>
        <MapContainer
          center={center}
          zoom={12}
          minZoom={10} // Set the minimum zoom level
          maxZoom={16} // Set the maximum zoom level
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapBoundsSetter />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((position, index) => (
            <Marker key={index} position={position}>
              <Popup>
                <div className="max-h-48 overflow-y-auto p-4">
                  <h3 className="text-lg font-semibold mb-2">{popupInfo?.details.nama}</h3>
                  <p className="text-sm text-gray-700 mb-1"><strong>Kota:</strong> {popupInfo?.details.kota}</p>
                  {popupInfo?.details.kecocokan && <p className="text-sm text-gray-700 mb-1"><strong>Kecocokan:</strong> {popupInfo.details.kecocokan}</p>}
                  {popupInfo?.details.okupasi && (
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Okupasi:</strong> {popupInfo.details.okupasi.toUpperCase()}
                      <br></br><strong>Kode:</strong> {popupInfo.details.kode_okupasi && ` ${popupInfo.details.kode_okupasi}`}
                    </p>
                  )}
                  {popupInfo?.details.unit_kompetensi && popupInfo.details.unit_kompetensi.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-md font-semibold">Unit Kompetensi:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {popupInfo.details.unit_kompetensi.map((kompetensi) => (
                          <li key={kompetensi.id}>{kompetensi.nama}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="w-full sm:w-2 h-full sm:h-auto overflow-y-auto bg-white">
        <Sidebar onSelectSchool={handleSchoolClick} />
      </div>
      {rateLimitExceeded && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-500 text-white text-center">
          You are making requests too quickly. Please wait a moment and try again.
        </div>
      )}
    </div>
  );
};

export default HomePage;
