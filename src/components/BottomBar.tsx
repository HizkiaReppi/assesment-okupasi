// src/components/BottomBar.tsx
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import Draggable from 'react-draggable';

const BottomBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDrag = (e: any, data: any) => {
    if (data.y < -100) {
      setIsOpen(true);
    } else if (data.y > 100) {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-0 w-full bg-white shadow-md z-50 transition-all duration-300 sm:hidden">
      <Draggable
        axis="y"
        bounds={{ top: -window.innerHeight + 200, bottom: 0 }}
        onDrag={handleDrag}
      >
        <div className={`absolute w-full bg-white ${isOpen ? 'h-full' : 'h-16'}`}>
          <div className="w-full h-16 bg-gray-100 flex items-center justify-between px-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <button className="focus:outline-none">
              {isOpen ? 'V' : '^'}
            </button>
            <button className="focus:outline-none">
              <FaFilter />
            </button>
          </div>
          <div className={`p-4 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
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
        </div>
      </Draggable>
    </div>
  );
};

export default BottomBar;
