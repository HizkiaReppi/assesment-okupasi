import React, { useState, useEffect } from 'react';
import { updateOkupasi, getOkupasiByKode } from '../../api/okupasi-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface OkupasiEditFormProps {
  kode: string;
  onSuccess: () => void;
}

const OkupasiEditForm: React.FC<OkupasiEditFormProps> = ({ kode, onSuccess }) => {
  const [nama, setNama] = useState<string>('');
  const [newKode, setNewKode] = useState<string>(kode);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchOkupasi = async () => {
      try {
        setLoading(true);
        const data = await getOkupasiByKode(kode);
        if (data && data.data) {
          setNama(data.data.nama);
          setNewKode(data.data.kode);
        }
      } catch (err) {
        setError('Gagal mengambil data okupasi. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchOkupasi();
  }, [kode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await updateOkupasi(kode, { kode: newKode, nama });
      if (response && response.status === 'success') {
        toast.success(
          <span>
            Item dengan kode <strong>{kode}</strong> berhasil diupdate menjadi kode <strong>{newKode}</strong> dan nama <strong>{nama}</strong>.
          </span>,
          { position: "bottom-right" }
        );
        onSuccess();
      } else {
        setError('Gagal memperbarui okupasi. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memperbarui okupasi. Silakan coba lagi.');
      console.error('Error updating okupasi:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Okupasi</h3>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-300" role="alert">
            <p>{error}</p>
          </div>
        )}
        <div className="mb-6">
          <label htmlFor="kode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kode
          </label>
          <input
            type="text"
            id="kode"
            value={newKode}
            onChange={(e) => setNewKode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama
          </label>
          <input
            type="text"
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Memperbarui...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OkupasiEditForm;