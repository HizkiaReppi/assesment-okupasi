/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { assessmentApi, Assessment } from '../../api/assessment-api';
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

interface AssessmentListProps {
  onEdit: (id: string, title: string, url: string) => void;
  refresh: boolean;
  editingId: string | null;
  onRefresh: () => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({
  onEdit,
  refresh,
  editingId,
  onRefresh,
}) => {
  const [assessment, setAssessment] = useState<Assessment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const itemsPerPage: number = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await assessmentApi.getAll(itemsPerPage, currentPage);
        if (data && Array.isArray(data.data)) {
          setAssessment(data.data);
          setTotalItems(data?.total_result || 0);
        }
      } catch (error) {
        console.error('Error fetching Konsentrasi:', error);
      }
    };

    fetchData();
  }, [refresh, currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsLoading(true);
      await assessmentApi.delete(deleteId);
      const deletedItem = assessment.find((item) => item.id === deleteId);
      setAssessment(assessment.filter((item) => item.id !== deleteId));
      setTotalItems(totalItems - 1);
      toast.error(
        `Assessment dengan nama ${deletedItem?.title} berhasil dihapus.`,
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
        Daftar Assessment
      </h2>
      <p className='text-sm text-gray-600 mb-4 dark:text-gray-300'>
        Data {itemsPerPage * (currentPage - 1) + 1} -{' '}
        {Math.min(itemsPerPage * currentPage, totalItems)} dari {totalItems}
      </p>
      <ul className='list-none'>
        {assessment.map((item) => (
          <li
            key={item.id}
            className={`mb-4 p-4 bg-gray-50 rounded-lg shadow-sm ${
              editingId === item.id
                ? 'bg-yellow-100'
                : 'bg-gray-50 dark:bg-gray-700'
            }`}
          >
            <span className='block text-gray-900 font-semibold mb-2 dark:text-white'>
              {item.title.toUpperCase()} <br />
              URL: {item.url}
            </span>
            <div className='mt-2 flex flex-wrap gap-2 justify-end'>
              <button
                onClick={() => onEdit(item.id, item.title, item.url)}
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

export default AssessmentList;
