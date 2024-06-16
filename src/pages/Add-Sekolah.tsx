import React, { useState } from 'react';
import { addSekolah } from '../api/sekolah-api'; // Pastikan impor ini sesuai dengan lokasi file API Anda
import { useNavigate } from 'react-router-dom';

const AddSekolah: React.FC = () => {
  const [nama, setNama] = useState('');
  const [kota, setKota] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addSekolah(nama, kota);
      navigate('/home');
    } catch (err) {
      setError('Gagal menambahkan sekolah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tambah Sekolah</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
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
            {loading ? 'Menambahkan...' : 'Tambah Sekolah'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSekolah;
