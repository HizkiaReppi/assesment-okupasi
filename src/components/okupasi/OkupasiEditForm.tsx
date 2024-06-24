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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOkupasi = async () => {
      try {
        setLoading(true);
        const data = await getOkupasiByKode(kode);
        if (data && data.data) {
          setNama(data.data.nama);
        }
      } catch (err) {
        setError('Error fetching okupasi data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOkupasi();
  }, [kode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateOkupasi(kode, kode, nama); // Using the same code for update
      if (response && response.status === 'success') {
        toast.success(
          <span dangerouslySetInnerHTML={{ __html: `Item dengan kode <strong>${kode}</strong> dan nama <strong>${nama}</strong> berhasil diupdate.` }} />,
          { position: "bottom-right" }
        );
        onSuccess();
      } else {
        setError('Error updating okupasi. Response: ' + JSON.stringify(response));
      }
    } catch (err) {
      setError('Error updating okupasi. Check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Edit Okupasi</h3>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="kode" className="block text-gray-700 mb-2">Kode</label>
          <input
            type="text"
            id="kode"
            value={kode}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nama" className="block text-gray-700 mb-2">Nama</label>
          <input
            type="text"
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </>
  );
};

export default OkupasiEditForm;
