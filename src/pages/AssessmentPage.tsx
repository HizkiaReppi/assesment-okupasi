import React, { useState, useEffect } from 'react';
import { useAssessments } from '../context/AssessmentContext';
import { assessmentApi, Assessment } from '../api/assessment-api';
import ReusableTable from '../components/ReusableTable';
import Pagination from '../components/pagination';
import PopupForm from '../components/PopupForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';

const AssessmentPage: React.FC = () => {
  const { assessments, refreshAssessments } = useAssessments();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null,
  );
  const [formData, setFormData] = useState({ title: '', url: '' });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    refreshAssessments();
  }, [currentPage]);

  const updateTotalPages = () => {
    setTotalPages(Math.ceil(assessments.length / itemsPerPage));
  };

  const handleAddAssessment = async () => {
    try {
      await assessmentApi.add(formData);
      toast.success('Assessment added successfully');
      setIsFormOpen(false);
      setFormData({ title: '', url: '' });
      refreshAssessments();
      updateTotalPages();
    } catch (error) {
      toast.error('Failed to add assessment');
    }
  };

  const handleUpdateAssessment = async () => {
    if (!editingAssessment || !editingAssessment.id) {
      toast.error('Invalid assessment data');
      return;
    }
    try {
      await assessmentApi.edit(editingAssessment.id, {
        title: formData.title,
        url: formData.url,
      });
      toast.success('Assessment updated successfully');
      setIsFormOpen(false);
      setEditingAssessment(null);
      setFormData({ title: '', url: '' });
      refreshAssessments();
      updateTotalPages();
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast.error('Failed to update assessment');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    {
      header: 'URL',
      accessor: 'url',
      cell: (value: string) => (
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 hover:underline'
        >
          {value}
        </a>
      ),
    },
  ];

  const openModal = (id: string) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDeleteId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await assessmentApi.delete(deleteId);
      const deletedItem = assessments.find((item) => item.id === deleteId);
      toast.error(
        `Assessment dengan nama ${deletedItem?.title} berhasil dihapus.`,
        {
          position: 'bottom-right',
        },
      );
      refreshAssessments();
      updateTotalPages();
      closeModal();
    } catch (error) {
      toast.error('Gagal menghapus data konsentrasi.', {
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      icon: faEdit,
      onClick: (row: Assessment) => {
        if (!row.id) {
          toast.error('Invalid assessment data');
          return;
        }
        setEditingAssessment(row);
        setFormData({ title: row.title, url: row.url });
        setIsFormOpen(true);
      },
      title: 'Edit',
    },
    {
      icon: faTrash,
      onClick: (row: Assessment) => {
        openModal(row.id);
      },
      title: 'Delete',
    },
  ];

  return (
    <div className='container pt-28 mx-auto p-4'>
      <button
        onClick={() => {
          setEditingAssessment(null);
          setFormData({ title: '', url: '' });
          setIsFormOpen(true);
        }}
        className='bg-gray-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center justify-center hover:bg-blue-700 transition duration-300'
      >
        <FontAwesomeIcon
          icon={faPlus}
          className='mr-2'
        />
        Add Assessment
      </button>
      <ReusableTable
        columns={columns}
        data={assessments.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage,
        )}
        actions={actions}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <PopupForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingAssessment ? 'Edit Assessment' : 'Add Assessment'}
      >
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg'>
          <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg relative z-10'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
                {editingAssessment
                  ? 'Edit Assessment'
                  : 'Tambah Assessment Baru'}
              </h2>
              <button onClick={() => setIsFormOpen(false)}>
                <FaTimes className='text-gray-600 dark:text-gray-200 hover:text-gray-800 transition duration-300' />
              </button>
            </div>
            <form
              className='space-y-4'
              onSubmit={(e) => {
                e.preventDefault();
                editingAssessment
                  ? handleUpdateAssessment()
                  : handleAddAssessment();
              }}
            >
              <div className='relative'>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className='w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:border-orange-500'
                  placeholder='Nama Assessment'
                />
              </div>
              <div className='relative'>
                <input
                  type='url'
                  id='url'
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                  className='w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:border-orange-500'
                  placeholder='URL Assessment'
                />
              </div>
              <button
                type='submit'
                className={`w-full bg-orange-700 text-white p-3 rounded-lg font-semibold hover:bg-orange-800 transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {editingAssessment ? 'Update' : 'Tambah'}
              </button>
            </form>
          </div>
        </div>
      </PopupForm>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        message='Yakin untuk menghapus item ini?'
        isLoading={loading}
      />
    </div>
  );
};

export default AssessmentPage;
