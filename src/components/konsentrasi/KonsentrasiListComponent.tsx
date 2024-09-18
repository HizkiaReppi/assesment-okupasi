/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { konsentrasiApi } from '../../api/konsentrasi-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import BackToTopButton from '../BackToTopButton';

interface KonsentrasiListProps {
  onEdit: (id: string, nama: string) => void;
  onViewKompetensi: (id: string, nama: string) => void;
  refresh: boolean;
  editingId: string | null;
  onRefresh: () => void;
}

const KonsentrasiList: React.FC<KonsentrasiListProps> = ({
  onEdit,
  refresh,
  editingId,
  onRefresh,
}) => {
  const [konsentrasi, setKonsentrasi] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const itemsPerPage: number = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await konsentrasiApi.getAll(
          searchQuery,
          itemsPerPage,
          currentPage,
        );
        if (data && Array.isArray(data.data)) {
          setKonsentrasi(data.data);
          setTotalItems(data?.total_result || 0);
        }
      } catch (error) {
        console.error('Error fetching Konsentrasi:', error);
      }
    };

    fetchData();
  }, [refresh, currentPage, searchQuery]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsLoading(true);
      await konsentrasiApi.delete(deleteId);
      const deletedItem = konsentrasi.find((item) => item.id === deleteId);
      setKonsentrasi(konsentrasi.filter((item) => item.id !== deleteId));
      setTotalItems(totalItems - 1);
      toast.error(
        `Konsentrasi dengan nama ${deletedItem.nama} berhasil dihapus.`,
        {
          position: 'bottom-right',
        },
      );
      closeModal();
      onRefresh();
    } catch (error) {
      toast.error('Gagal menghapus data konsentrasi.', {
        position: 'bottom-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (id: string) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDeleteId(null);
    setIsModalOpen(false);
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageButtons = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    if (currentPage > 1) {
      pageButtons.push(
        <button
          key='prev'
          onClick={() => handlePageChange(currentPage - 1)}
          className='relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>,
      );
    }

    if (currentPage > 2) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className='relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        >
          1
        </button>,
      );
    }

    if (currentPage > 3) {
      pageButtons.push(
        <span
          key='dots1'
          className='px-3 py-1 mx-1'
        >
          ...
        </span>,
      );
    }

    if (currentPage > 1) {
      pageButtons.push(
        <button
          key={currentPage - 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className='relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        >
          {currentPage - 1}
        </button>,
      );
    }

    pageButtons.push(
      <button
        key={currentPage}
        className='relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-500 text-white dark:bg-gray-800 dark:text-white'
      >
        {currentPage}
      </button>,
    );

    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key={currentPage + 1}
          onClick={() => handlePageChange(currentPage + 1)}
          className='relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        >
          {currentPage + 1}
        </button>,
      );
    }

    if (currentPage < totalPages - 2) {
      pageButtons.push(
        <span
          key='dots2'
          className='px-3 py-1 mx-1'
        >
          ...
        </span>,
      );
    }

    if (currentPage < totalPages - 1) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className='relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        >
          {totalPages}
        </button>,
      );
    }

    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key='next'
          onClick={() => handlePageChange(currentPage + 1)}
          className='relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>,
      );
    }

    return pageButtons;
  };

  return (
    <div className='mb-6 p-4 bg-white rounded-lg shadow-md relative dark:bg-gray-800 dark:text-gray-200'>
      <h2 className='text-xl font-bold text-gray-800 mb-4 dark:text-white'>
        Daftar Konsentrasi
      </h2>
      <div className='flex mb-4'>
        <input
          type='text'
          placeholder='Cari nama Konsentrasi'
          value={searchTerm}
          onChange={handleSearchChange}
          className='p-2 border border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white'
        />
        <button
          onClick={handleSearch}
          className='ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600'
        >
          Search
        </button>
        <button
          onClick={handleClearSearch}
          className='ml-2 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500'
        >
          Batalkan
        </button>
      </div>
      <p className='text-sm text-gray-600 mb-4 dark:text-gray-300'>
        Data {itemsPerPage * (currentPage - 1) + 1} -{' '}
        {Math.min(itemsPerPage * currentPage, totalItems)} dari {totalItems}
      </p>
      <ul className='list-none'>
        {konsentrasi.map((item) => (
          <li
            key={item.id}
            className={`mb-4 p-4 bg-gray-50 rounded-lg shadow-sm ${
              editingId === item.id
                ? 'bg-yellow-100'
                : 'bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <span className='block text-gray-900 font-semibold mb-2 dark:text-white'>
              {item.nama.toUpperCase()} <br />
              Jumlah Sekolah: 1
            </span>
            <div className='mt-2 flex flex-wrap gap-2 justify-end'>
              <button
                onClick={() => onEdit(item.id, item.nama)}
                className='relative overflow-hidden text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className='mr-1'
                />{' '}
                Edit
              </button>
              <button
                onClick={() => openModal(item.id)}
                className='relative overflow-hidden text-sm bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 dark:bg-red-600 dark:text-red-200 dark:hover:bg-red-500'
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className='mt-4 flex justify-center'>{renderPagination()}</div>
      <BackToTopButton />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        message='Yakin untuk menghapus item ini?'
        isLoading={isLoading}
      />
    </div>
  );
};

export default KonsentrasiList;
