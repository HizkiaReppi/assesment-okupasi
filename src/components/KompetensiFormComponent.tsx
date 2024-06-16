import React, { useState } from 'react';

interface KompetensiFormComponentProps {
  addKompetensi: (kode: string, unit_kompetensi: { id: string }[]) => void;
}

const KompetensiFormComponent: React.FC<KompetensiFormComponentProps> = ({ addKompetensi }) => {
  const [kode, setKode] = useState('');
  const [unitKompetensi, setUnitKompetensi] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const unit_kompetensi = unitKompetensi.split(',').map((id) => ({ id }));
    addKompetensi(kode, unit_kompetensi);
    setKode('');
    setUnitKompetensi('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tambah Kompetensi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Kode</label>
          <input
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">Unit Kompetensi (pisahkan dengan koma)</label>
          <input
            type="text"
            value={unitKompetensi}
            onChange={(e) => setUnitKompetensi(e.target.value)}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 transition duration-200"
        >
          Tambah Kompetensi
        </button>
      </form>
    </div>
  );
};

export default KompetensiFormComponent;
