import React, { ReactNode } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

interface CustomIconMarkerProps {
  position: L.LatLng;
  onClick?: () => void;
  children?: ReactNode;
}

const CustomIconMarker: React.FC<CustomIconMarkerProps> = ({ position, onClick, children }) => {
  const customIcon = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  return (
    <Marker position={position} icon={customIcon} eventHandlers={{ click: onClick }}>
      {children}
    </Marker>
  );
};

export default CustomIconMarker;