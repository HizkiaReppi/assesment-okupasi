import React, { useState, useEffect } from 'react';
import { addSekolah, editSekolahById } from '../api/sekolah-api';

interface SchoolFormComponentProps {
  editId: string | null;
  setEditId: (id: string | null) => void;
  fetchSchools: () => void;
  setError: (error: string) => void;
}

const SchoolFormComponent: React.FC<SchoolFormComponentProps> = ({ editId, setEditId, fetchSchools, setError }) => {
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
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700">Kota</label>
          <input
            type="text"
            value={kota}
            onChange={(e) => setKota(e.target.value)}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Memproses...' : editId ? 'Update Sekolah' : 'Tambah Sekolah'}
        </button>
      </form>
    </div>
  );
};

export default SchoolFormComponent;
