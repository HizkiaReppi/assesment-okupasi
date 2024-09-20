import React, { useState, useEffect } from 'react';
import { assessmentApi, Assessment } from '../api/assessment-api';
import ReusableTable from '../components/table';
import Pagination from '../components/pagination';
import PopupForm from '../components/PopupForm';
import Loading from '../components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AssessmentPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState({ title: '', url: '' });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAssessments();
  }, [currentPage]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const data = await assessmentApi.getAll();
      setAssessments(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      toast.error('Failed to fetch assessments');
    }
    setLoading(false);
  };

  const handleAddAssessment = async () => {
    try {
      await assessmentApi.add(formData);
      toast.success('Assessment added successfully');
      setIsFormOpen(false);
      setFormData({ title: '', url: '' });
      fetchAssessments();
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
        url: formData.url
      });
      toast.success('Assessment updated successfully');
      setIsFormOpen(false);
      setEditingAssessment(null);
      setFormData({ title: '', url: '' });
      fetchAssessments();
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast.error('Failed to update assessment');
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    if (!id) {
      toast.error('Invalid assessment ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await assessmentApi.delete(id);
        toast.success('Assessment deleted successfully');
        fetchAssessments();
      } catch (error) {
        console.error('Error deleting assessment:', error);
        toast.error('Failed to delete assessment');
      }
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'URL', accessor: 'url', cell: (value: string) => <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{value}</a> },
  ];

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
      title: 'Edit' 
    },
    { 
      icon: faTrash, 
      onClick: (row: Assessment) => {
        if (!row.id) {
          toast.error('Invalid assessment data');
          return;
        }
        handleDeleteAssessment(row.id);
      }, 
      title: 'Delete' 
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container pt-28 mx-auto p-4">
      <button
        onClick={() => { setEditingAssessment(null); setFormData({ title: '', url: '' }); setIsFormOpen(true); }}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add Assessment
      </button>
      <ReusableTable
        columns={columns}
        data={assessments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
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
        <form onSubmit={(e) => { e.preventDefault(); editingAssessment ? handleUpdateAssessment() : handleAddAssessment(); }}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
            <input
              type="url"
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingAssessment ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </PopupForm>
    </div>
  );
};

export default AssessmentPage;