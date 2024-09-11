import React from 'react';
import { Marker, MarkerProps } from 'react-leaflet';
import L from 'leaflet';

interface CustomIconMarkerProps {
  onClick?: (event: L.LeafletMouseEvent) => void;
  position: L.LatLngExpression;
  children: React.ReactNode;
}

interface CustomIconMarkerProps extends MarkerProps {
  children: React.ReactNode;
}

const customIcon = L.icon({
  iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

const CustomIconMarker: React.FC<CustomIconMarkerProps> = ({ position, children, eventHandlers, ...props }) => {
  const validPosition = position instanceof L.LatLng
    ? position
    : Array.isArray(position) && position.length === 2
    ? [position[0], position[1]]
    : [0, 0];  // fallback jika tidak valid

  return (
    <Marker 
      position={validPosition as L.LatLngExpression} 
      icon={customIcon} 
      eventHandlers={eventHandlers}
      {...props}
    >
      {children}
    </Marker>
  );
};

export default CustomIconMarker;