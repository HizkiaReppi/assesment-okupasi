import React from 'react';

interface Kompetensi {
  kode: string;
  nama: string;
  unit_kompetensi: {
    id: string;
    nama: string;
  }[];
}

interface InfoBarProps {
  school: { lat: number, lng: number, name: string } | null;
  kompetensi: Kompetensi[];
  onClose: () => void;
}

const InfoBar: React.FC<InfoBarProps> = ({ school, kompetensi, onClose }) => {
  if (!school) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-white p-4 rounded shadow-lg w-96 relative dark:bg-gray-800 dark:text-gray-200">
        <button onClick={onClose} className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">{school.name}</h2>
        <h3 className="text-lg font-semibold mt-4">Okupasi :</h3>
        <ul className="list-disc">
          {kompetensi.map(komp => (
            <li key={komp.kode} className="mb-2">
              <strong>{komp.nama}</strong>
              <p className="text-sm">Kompetensi :</p>
              <ul className="list-disc pl-5">
                {komp.unit_kompetensi.map(unit => (
                  <li key={unit.id} className="text-sm">{unit.nama}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoBar;
