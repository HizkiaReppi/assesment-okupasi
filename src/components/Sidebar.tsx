// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed top-16 right-0 h-[calc(100%-4rem)] bg-white shadow-md z-50 ${isOpen ? 'w-80' : 'w-10'} transition-all duration-300`}>
      <button onClick={toggleSidebar} className="p-2 focus:outline-none">
        {isOpen ? '>' : '<'}
      </button>
      {isOpen && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border rounded w-full"
            />
            <button className="ml-2">
              <FaFilter />
            </button>
          </div>
          <div className="mt-4">
            {/* List of places, replace with dynamic data later */}
            <div className="p-2 border-b">
              <h3 className="font-bold">SMKN 3 Manado</h3>
              <p>Pengembangan Perangkat Lunak Dan Gim</p>
            </div>
            <div className="p-2 border-b">
              <h3 className="font-bold">SMKN 5 Talaud</h3>
              <p>Pengembangan Perangkat Lunak Dan Gim</p>
            </div>
            <div className="p-2 border-b">
              <h3 className="font-bold">SMKN 2 Kotamobagu</h3>
              <p>Pengembangan Perangkat Lunak Dan Gim</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
