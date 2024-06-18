import React, { useState, useEffect } from 'react';
import { getAllSekolah, deleteSekolahById } from '../api/sekolah-api';
import SchoolFormComponent from '../components/sekolah/SchoolFormComponent';
import SchoolListComponent from '../components/sekolah/SchoolListComponent';
import useIsDesktop from '../hooks/useIsDesktop';

interface School {
  id: string;
  nama: string;
  kota: string;
}

const DataSekolahPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const isDesktop = useIsDesktop();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSchools();
  }, [currentPage]);

  const fetchSchools = async () => {
    try {
      const data = await getAllSekolah(undefined, 5, currentPage);
      setSchools(data.data);
      setTotalPages(data.total_page);
    } catch (err) {
      setError('Gagal memuat data sekolah.');
    }
  };

  const handleEdit = (school: School) => {
    setEditId(school.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSekolahById(id);
      fetchSchools();
    } catch (err) {
      setError('Gagal menghapus sekolah. Silakan coba lagi.');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 pt-16 md:px-0">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl">
        <div className={`flex ${isDesktop ? 'flex-row' : 'flex-col'} gap-6`}>
          <div className="flex-1">
            <SchoolFormComponent
              editId={editId}
              setEditId={setEditId}
              fetchSchools={fetchSchools}
              setError={setError}
            />
            {editId && (
              <button onClick={handleCancelEdit} className="mt-4 text-blue-500 hover:text-blue-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
          </div>
          <div className="flex-1">
            <SchoolListComponent
              schools={schools}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              editId={editId}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSekolahPage;
