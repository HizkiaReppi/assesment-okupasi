import { useState } from 'react';
import KonsentrasiList from '../components/konsentrasi/KonsentrasiListComponent';
import KonsentrasiAddForm from '../components/konsentrasi/KonsentrasiAddFormComponent';
import ErrorNotification from '../components/ErrorNotification';
import Modal from '../components/EditModal';
import KonsentrasiEditForm from '../components/konsentrasi/KonsentrasiEditFormComponent';

const DataKonsentrasiPage: React.FC = () => {
  const [editingKonsentrasiId, setEditingKonsentrasiId] = useState<
    string | null
  >(null);
  const [addingKonsentrasi, setAddingKonsentrasi] = useState<boolean>(false);
  const [selectedKonsentrasi, setSelectedKonsentrasi] = useState<{
    id: string | null;
    nama: string;
  }>({ id: null, nama: '' });
  const [refresh, setRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefresh = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleError = (message: string | string[]) => {
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    setErrorMessage(errorMessage);
  };

  const handleEditKonsentrasi = (id: string, nama: string) => {
    setSelectedKonsentrasi({ id, nama });
    setEditingKonsentrasiId(id);
  };

  const handleAddKonsentrasi = () => {
    setAddingKonsentrasi(true);
  };

  return (
    <div className='bg-gray-100 min-h-screen p-6 dark:bg-gray-900 dark:text-gray-200'>
      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <div className='bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-200'>
        <h1 className='text-2xl font-bold text-center mb-4 pt-8 dark:text-white'>
          Data Konsentrasi
        </h1>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-full max-w-3xl'>
            <button
              onClick={handleAddKonsentrasi}
              className='flex items-center text-black mb-4 bg-slate-300 hover:bg-slate-400 ease-in-out duration-300 p-2 rounded-md dark:text-gray-200 dark:bg-slate-600 dark:hover:bg-slate-700'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 4v16m8-8H4'
                ></path>
              </svg>
              Data Konsentrasi
            </button>
            <KonsentrasiList
              onEdit={handleEditKonsentrasi}
              refresh={refresh}
              editingId={editingKonsentrasiId}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!editingKonsentrasiId}
        onClose={() => setEditingKonsentrasiId(null)}
      >
        <KonsentrasiEditForm
          id={selectedKonsentrasi.id || ''}
          initialNama={selectedKonsentrasi.nama}
          onSuccess={() => {
            setEditingKonsentrasiId(null);
            handleRefresh();
          }}
          onError={handleError}
        />
      </Modal>

      <Modal
        isOpen={addingKonsentrasi}
        onClose={() => setAddingKonsentrasi(false)}
      >
        <KonsentrasiAddForm
          onAddSuccess={() => {
            setAddingKonsentrasi(false);
            handleRefresh();
          }}
        />
      </Modal>
    </div>
  );
};

export default DataKonsentrasiPage;
