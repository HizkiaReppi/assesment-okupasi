import React, { useEffect, useState } from 'react';
import {
  getAllKompetensi,
  deleteKompetensiById,
  deleteKompetensiByKodeOkupasi,
} from '../../api/sekolah-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faSearch,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../pagination';
import ReusableTable from '../ReusableTable';

interface KompetensiListProps {
  sekolahId: string;
  schoolName: string;
  okupasiName: string;
  onEdit: (unitId: string, initialKode: string) => void;
  refresh: boolean;
  editingUnitId: string | null;
}

const KompetensiList: React.FC<KompetensiListProps> = ({
  sekolahId,
  schoolName,
  okupasiName,
  onEdit,
  refresh,
}) => {
  const [kompetensi, setKompetensi] = useState<any[]>([]);
  const [filteredKompetensi, setFilteredKompetensi] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllKompetensi(sekolahId);
      if (data && Array.isArray(data.data)) {
        setKompetensi(data.data);
        setFilteredKompetensi(data.data);
      } else {
        console.error('Invalid data format:', data);
        setKompetensi([]);
        setFilteredKompetensi([]);
      }
    } catch (error) {
      console.error('Error fetching kompetensi:', error);
      setKompetensi([]);
      setFilteredKompetensi([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sekolahId, refresh]);

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = kompetensi.filter(
      (item) =>
        item.kode.toLowerCase().includes(lowercasedSearch) ||
        item.nama.toLowerCase().includes(lowercasedSearch) ||
        item.unit_kompetensi.some((unit: any) =>
          unit.nama.toLowerCase().includes(lowercasedSearch),
        ),
    );
    setFilteredKompetensi(filtered);
    setCurrentPage(1);
  }, [searchTerm, kompetensi]);

  const handleDelete = async () => {
    if (selectedItem) {
      try {
        if (selectedItem.kode) {
          await deleteKompetensiByKodeOkupasi(sekolahId, selectedItem.kode);
          toast.success('Kompetensi dengan kode berhasil dihapus.', {
            position: 'bottom-right',
          });
        } else {
          await deleteKompetensiById(sekolahId, selectedItem.id);
          toast.success('Kompetensi berhasil dihapus.', {
            position: 'bottom-right',
          });
        }
        fetchData();
        setShowDeleteModal(false);
        setSelectedItem(null);
      } catch (error) {
        toast.error('Gagal menghapus kompetensi.', {
          position: 'bottom-right',
        });
        console.error('Error deleting Kompetensi:', error);
      }
    }
  };

  const confirmDelete = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleViewDetail = (item: any) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredKompetensi.length / itemsPerPage),
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const columns = [
    { header: 'No', accessor: 'index' },
    { header: 'Kode Okupasi', accessor: 'kode' },
    { header: 'Nama Okupasi', accessor: 'nama' },
    { header: 'Unit Kompetensi', accessor: 'unitKompetensi' },
  ];

  const actions = [
    {
      icon: faEye,
      onClick: (row: any) => handleViewDetail(row),
      title: 'View Details',
      class:
        'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
    },
    {
      icon: faEdit,
      onClick: (row: any) => onEdit(row.kode, row.unit_id),
      title: 'Edit',
      class:
        'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
    },
    {
      icon: faTrash,
      onClick: (row: any) => confirmDelete(row),
      title: 'Delete',
      class:
        'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
    },
  ];

  const paginatedData = filteredKompetensi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const preparedData = paginatedData.map((item, index) => ({
    index: (currentPage - 1) * itemsPerPage + index + 1,
    kode: item.kode,
    nama: truncateText(item.nama, 30),
    unitKompetensi: (
      <ul className='list-disc list-inside'>
        {item.unit_kompetensi.map((unit: any) => (
          <li
            key={unit.id}
            className='mb-2'
          >
            <strong>{unit.kode_unit}</strong>: {truncateText(unit.nama, 50)}
          </li>
        ))}
      </ul>
    ),
    ...item,
  }));

  return (
    <div className='mb-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white'>
      <h3 className='text-lg font-bold text-gray-800 mb-4 dark:text-white'>
        Daftar Kompetensi - {schoolName} - {okupasiName}
      </h3>
      <div className='mb-4'>
        <div className='flex mb-3 relative'>
          <input
            type='text'
            placeholder='Search by Kode or Nama...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full p-3 pr-10 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          />
          <FontAwesomeIcon
            icon={faSearch}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
          />
        </div>
      </div>
      {preparedData.length > 0 ? (
        <>
          <ReusableTable
            columns={columns}
            data={preparedData}
            actions={actions}
          />
          <div className='mt-4'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p className='dark:text-white'>No kompetensi found.</p>
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        message={`Are you sure you want to delete ${
          selectedItem?.nama || 'this item'
        }?`}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
      {showDetailModal && selectedItem && (
        <div
          className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className='relative top-20 mx-auto p-8 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white dark:bg-gray-800'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-6'>
              Detail Kompetensi
            </h3>
            <div className='space-y-4'>
              <p>
                <strong className='font-medium'>Kode Okupasi:</strong>{' '}
                {selectedItem.kode}
              </p>
              <p>
                <strong className='font-medium'>Nama Okupasi:</strong>{' '}
                {selectedItem.nama}
              </p>
              <div>
                <strong className='font-medium'>Unit Kompetensi:</strong>
                <ul className='list-none mt-2 space-y-4'>
                  {selectedItem.unit_kompetensi.map((unit: any) => (
                    <li
                      key={unit.id}
                      className='pl-4 border-l-2 border-gray-300'
                    >
                      <p className='font-medium'>
                        {unit.kode_unit}: {unit.nama}
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                        Standard: {unit.standard_kompetensi}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='mt-8 text-right'>
              <button
                onClick={() => setShowDetailModal(false)}
                className='px-4 py-2 bg-red-400 text-white text-sm font-medium rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KompetensiList;
