import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assessmentApi } from '../../api/assessment-api';

interface EditAssessmentFormProps {
  id: string;
  initialTitle: string;
  initialUrl: string;
  onSuccess: () => void;
  onError: (message: string | string[]) => void;
}

const AssessmentEditForm: React.FC<EditAssessmentFormProps> = ({
  id,
  initialTitle,
  initialUrl,
  onSuccess,
  onError,
}) => {
  const [title, setTitle] = useState<string>(initialTitle || '');
  const [url, setUrl] = useState<string>(initialUrl || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    setTitle(initialTitle || '');
    setUrl(initialUrl || '');
  }, [initialTitle, initialUrl]);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    setIsEdited(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      toast.error('Nama Assessment dan Kota tidak boleh kosong.', {
        position: 'bottom-right',
      });
      return;
    }

    if (url.trim() === '') {
      toast.error('URL Assessment dan Kota tidak boleh kosong.', {
        position: 'bottom-right',
      });
      return;
    }

    try {
      setIsLoading(true);
      await assessmentApi.edit(id, title, url);
      toast.success(`Assessment ${title} berhasil diupdate.`, {
        position: 'bottom-right',
      });
      onSuccess();
      setIsEdited(false);
    } catch (error) {
      onError('Gagal mengupdate data Assessment. Silakan coba lagi.');
      toast.error('Gagal mengupdate data Assessment.', {
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
        Edit Assessment
      </h2>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2 dark:text-gray-300'>
          Nama:
        </label>
        <input
          type='text'
          value={title}
          onChange={(e) => handleInputChange(setTitle, e.target.value)}
          className={`w-full p-3 border ${
            isEdited ? 'border-blue-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
          required
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 mb-2 dark:text-gray-300'>
          URL:
        </label>
        <input
          type='text'
          value={url}
          onChange={(e) => handleInputChange(setUrl, e.target.value)}
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

export default AssessmentEditForm;
