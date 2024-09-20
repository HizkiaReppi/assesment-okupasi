import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assessmentApi } from '../../api/assessment-api';

interface AssessmentAddFormProps {
  onAddSuccess: () => void;
}

const AssessmentAddForm: React.FC<AssessmentAddFormProps> = ({
  onAddSuccess,
}) => {
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      setError('Nama tidak boleh kosong.');
      toast.error('Nama tidak boleh kosong.', {
        position: 'bottom-right',
      });
      return;
    }

    if (url.trim() === '') {
      setError('URL tidak boleh kosong.');
      toast.error('URL tidak boleh kosong.', {
        position: 'bottom-right',
      });
      return;
    }

    try {
      setIsLoading(true);
      await assessmentApi.add({ title, url });

      setTitle('');
      setUrl('');
      setError(null);
      onAddSuccess();
      toast.success(`Assessment ${title} berhasil ditambahkan.`, {
        position: 'bottom-right',
      });
    } catch (error) {
      console.error('Error adding Assessment:', error);
      setError('Gagal menambahkan Assessment. Silakan coba lagi.');
      toast.error('Gagal menambahkan Assessment. Silakan coba lagi.', {
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
      <h2 className='text-lg font-bold text-black mb-4 dark:text-white'>
        Tambah Assessment
      </h2>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      <div>
        <label className='block text-gray-700 dark:text-gray-300'>Nama:</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value.trim())}
          required
          className='mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white'
        />
      </div>
      <div>
        <label className='block text-gray-700 dark:text-gray-300'>URL:</label>
        <input
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className='mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white'
        />
      </div>
      <button
        type='submit'
        className='mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300 disabled:bg-gray-300 disabled:text-gray-700'
        disabled={isLoading}
      >
        {isLoading ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
};

export default AssessmentAddForm;
