import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { konsentrasiApi } from '../../api/konsentrasi-api';

interface EditKonsentrasiFormProps {
  id: string;
  initialNama: string;
  onSuccess: () => void;
  onError: (message: string | string[]) => void;
}

const KonsentrasiEditForm: React.FC<EditKonsentrasiFormProps> = ({
  id,
  initialNama,
  onSuccess,
  onError,
}) => {
  const [nama, setNama] = useState<string>(initialNama || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    setNama(initialNama || '');
  }, [initialNama]);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    setIsEdited(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nama.trim() === '') {
      toast.error('Nama Sekolah dan Kota tidak boleh kosong.', {
        position: 'bottom-right',
      });
      return;
    }

    try {
      setIsLoading(true);
      await konsentrasiApi.edit(id, nama);
      toast.success(`Konsentrasi ${nama} berhasil diupdate.`, {
        position: 'bottom-right',
      });
      onSuccess();
      setIsEdited(false);
    } catch (error) {
      onError('Gagal mengupdate data konsentrasi. Silakan coba lagi.');
      toast.error('Gagal mengupdate data konsentrasi.', {
        position: 'bottom-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mb-6 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800'
    >
      <h2 className='text-xl font-bold text-gray-800 mb-4 dark:text-white'>
        Edit Konsentrasi
      </h2>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2 dark:text-gray-300'>
          Nama:
        </label>
        <input
          type='text'
          value={nama}
          onChange={(e) => handleInputChange(setNama, e.target.value)}
          className={`w-full p-3 border ${
            isEdited ? 'border-blue-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
          required
        />
      </div>
      <button
        type='submit'
        className='bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 ease-in-out dark:bg-white dark:text-black dark:hover:bg-gray-300 disabled:bg-gray-300 disabled:text-gray-700'
        disabled={isLoading}
      >
        {isLoading ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
};

export default KonsentrasiEditForm;
