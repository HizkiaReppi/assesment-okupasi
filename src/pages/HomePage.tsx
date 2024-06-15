// src/pages/HomePage.tsx
import React from 'react';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';

const HomePage: React.FC = () => {
  return (
    <div className="relative flex flex-col sm:flex-row h-screen overflow-hidden">
      <div className="flex-grow">
        <Map />
      </div>
      <Sidebar />
    </div>
  );
};

export default HomePage;
