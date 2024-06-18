import React, { useState, useEffect } from 'react';
import { addSekolah, editSekolahById } from '../../api/sekolah-api';

interface SchoolFormComponentProps {
  editId: string | null;
  setEditId: (id: string | null) => void;
  fetchSchools: () => void;
  setError: (error: string) => void;
}

const SchoolFormComponent: React.FC<SchoolFormComponentProps> = ({
  editId, setEditId, fetchSchools, setError
}) => {
  const [nama, setNama] = useState('');
  const [kota, setKota] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editId) {
      setNama('');
      setKota('');
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await editSekolahById(editId, nama, kota);
      } else {
        await addSekolah(nama, kota);
      }
      setNama('');
      setKota('');
      setEditId(null);
      fetchSchools();
    } catch (err) {
      setError('Gagal memproses data sekolah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Sekolah' : 'Tambah Sekolah'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Kota</label>
          <input
            type="text"
            value={kota}
            onChange={(e) => setKota(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <button
          type="submit"
          className="relative w-full bg-transparent text-gray-800 p-2 rounded mt-4 border border-gray-800 hover:bg-gray-800 hover:text-white transition duration-200"
          disabled={loading}
        >
          <span className="block relative z-10">{loading ? 'Memproses...' : editId ? 'Update Sekolah' : 'Tambah Sekolah'}</span>
          <div className="absolute top-0 left-0 w-full h-full bg-gray-600 rounded transform scale-0 group-hover:scale-150 transition-transform duration-300 ease-out" style={{ clipPath: 'circle(30% at center)' }}></div>
        </button>
      </form>
    </div>
  );
};

export default SchoolFormComponent;
