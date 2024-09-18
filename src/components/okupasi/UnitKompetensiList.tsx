import React, { useEffect, useState } from 'react';
import { getOkupasiByKode, deleteUnitKompetensi } from '../../api/okupasi-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faSearch,
  faTimes,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UnitKompetensi {
  id: string;
  kode_unit: string;
  nama: string;
  standard_kompetensi: string;
}

interface UnitKompetensiListProps {
  kode: string;
  okupasiName: string;
  onEdit: (
    unitId: string,
    kode_unit: string,
    nama: string,
    standard_kompetensi: string,
  ) => void;
  refresh: boolean;
  editingUnitId?: string | null;
}

const UnitKompetensiList: React.FC<UnitKompetensiListProps> = ({
  kode,
  okupasiName,
  onEdit,
  refresh,
  editingUnitId,
}) => {
  const [unitKompetensi, setUnitKompetensi] = useState<UnitKompetensi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitKompetensi | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await getOkupasiByKode(kode);
        if (data && data.data && Array.isArray(data.data.unit_kompetensi)) {
          setUnitKompetensi(data.data.unit_kompetensi);
        }
      } catch (error) {
        console.error('Error fetching unit kompetensi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kode, refresh]);

  const handleDelete = async () => {
    if (selectedUnit) {
      try {
        await deleteUnitKompetensi(kode, selectedUnit.id);
        setUnitKompetensi(
          unitKompetensi.filter((unit) => unit.id !== selectedUnit.id),
        );
        toast.error(`Unit kompetensi ${selectedUnit.nama} berhasil dihapus.`, {
          position: 'bottom-right',
        });
        setShowDeleteModal(false);
        setSelectedUnit(null);
      } catch (error) {
        console.error('Error deleting Unit Kompetensi:', error);
      }
    }
  };

  const confirmDelete = (unit: UnitKompetensi) => {
    setSelectedUnit(unit);
    setShowDeleteModal(true);
  };

  const handleViewDetail = (unit: UnitKompetensi) => {
    setSelectedUnit(unit);
    setShowDetailModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const filteredUnits = unitKompetensi.filter(
    (unit) =>
      unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.kode_unit.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUnits.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white overflow-hidden'>
      <div className='p-6'>
        <h3 className='text-2xl font-bold text-gray-800 mb-6 dark:text-white'>
          Daftar Unit Kompetensi - {okupasiName}
        </h3>
        <div className='flex mb-6'>
          <div className='relative flex-grow'>
            <input
              type='text'
              placeholder='Cari unit kompetensi atau kode unit'
              value={searchTerm}
              onChange={handleSearchChange}
              className='w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            />
            <FontAwesomeIcon
              icon={faSearch}
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
            />
          </div>
          <button
            onClick={handleSearch}
            className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out'
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className='ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out'
            >
              <FontAwesomeIcon
                icon={faTimes}
                className='mr-2'
              />
              Clear
            </button>
          )}
        </div>
        <p className='text-sm text-gray-600 mb-4 dark:text-gray-400'>
          Total Items: {filteredUnits.length} | Page: {currentPage} of{' '}
          {totalPages}
        </p>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'
                >
                  Kode Unit
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'
                >
                  Nama
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'
                >
                  Standard Kompetensi
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400'
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
              {currentItems.map((unit) => (
                <tr
                  key={unit.id}
                  className={
                    editingUnitId === unit.id
                      ? 'bg-yellow-50 dark:bg-yellow-900'
                      : ''
                  }
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                    {unit.kode_unit ?? '-'}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-300'>
                    <div
                      className='line-clamp-2'
                      title={unit.nama}
                    >
                      {unit.nama}
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 dark:text-gray-300'>
                    <div
                      className='line-clamp-2'
                      title={unit.standard_kompetensi ?? '-'}
                    >
                      {unit.standard_kompetensi ?? '-'}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <button
                      onClick={() => handleViewDetail(unit)}
                      className='text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2'
                      title='View Details'
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() =>
                        onEdit(
                          unit.id,
                          unit.kode_unit,
                          unit.nama,
                          unit.standard_kompetensi,
                        )
                      }
                      className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2'
                      title='Edit'
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => confirmDelete(unit)}
                      className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                      title='Delete'
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-6 flex justify-between'>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            } transition duration-300 ease-in-out`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            } transition duration-300 ease-in-out`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={`Are you sure you want to delete ${selectedUnit?.nama}?`}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />

      {/* Detail Modal */}
      {showDetailModal && selectedUnit && (
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className='relative top-20 mx-auto p-8 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white dark:bg-gray-800'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='absolute top-4 right-4'>
              <button
                onClick={() => setShowDetailModal(false)}
                className='text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200'
              >
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-6'>
              Detail Unit Kompetensi
            </h3>
            <div className='space-y-6'>
              <div>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Kode Unit
                </p>
                <p className='text-base text-gray-900 dark:text-white'>
                  {selectedUnit.kode_unit}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Nama
                </p>
                <p className='text-base text-gray-900 dark:text-white'>
                  {selectedUnit.nama}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
                  Standard Kompetensi
                </p>
                <p className='text-base text-gray-900 dark:text-white whitespace-pre-wrap'>
                  {selectedUnit.standard_kompetensi}
                </p>
              </div>
            </div>
            <div className='mt-8 text-right'>
              <button
                onClick={() => setShowDetailModal(false)}
                className='px-4 py-2 bg-red-400 text-white text-sm font-medium rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200'
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitKompetensiList;
