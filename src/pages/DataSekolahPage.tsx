import { useState, useEffect } from 'react';
import {
  getAllSekolah,
  deleteSekolahById,
  getAllKompetensi,
  addKompetensi,
  editKompetensi,
  deleteKompetensiById,
  getAllSekolahStatByKodeOkupasi
} from '../api/sekolah-api';
import SchoolFormComponent from '../components/sekolah/SchoolFormComponent';
import SchoolListComponent from '../components/sekolah/SchoolListComponent';
import KompetensiListComponent from '../components/sekolah/KompetensiListComponent';
import KompetensiFormComponent from '../components/sekolah/KompetensiFormComponent';

interface School {
  id: string;
  nama: string;
  kota: string;
}

interface Kompetensi {
  id: string;
  kode: string;
  unit_kompetensi: { id: string }[];
}

const DataSekolahPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [kompetensi, setKompetensi] = useState<Kompetensi[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for tab selection
  const [activeTab, setActiveTab] = useState<'schools' | 'kompetensi'>('schools');

  useEffect(() => {
    if (activeTab === 'schools') {
      fetchSchools();
    } else {
      fetchKompetensi();
    }
  }, [activeTab, currentPage]);

  const fetchSchools = async () => {
    try {
      const data = await getAllSekolah(undefined, 5, currentPage);
      setSchools(data.data);
      setTotalPages(data.total_page);
    } catch (err) {
      setError('Gagal memuat data sekolah.');
    }
  };

  const fetchKompetensi = async () => {
    if (!selectedSchool) return;
    try {
      const data = await getAllKompetensi(selectedSchool.id, undefined, 5, currentPage);
      setKompetensi(data.data);
      setTotalPages(data.total_page);
    } catch (err) {
      setError('Gagal memuat data kompetensi.');
    }
  };

  const handleEdit = (school: School) => {
    setEditId(school.id);
    setSelectedSchool(school);
    fetchKompetensi();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSekolahById(id);
      fetchSchools();
    } catch (err) {
      setError('Gagal menghapus sekolah. Silakan coba lagi.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddKompetensi = async (kode: string, unit_kompetensi: { id: string }[]) => {
    if (!selectedSchool) return;
    try {
      await addKompetensi(selectedSchool.id, kode, unit_kompetensi);
      fetchKompetensi();
    } catch (err) {
      setError('Gagal menambah kompetensi. Silakan coba lagi.');
    }
  };

  const handleEditKompetensi = async (kompetensiId: string, kode: string, unit_kompetensi: { id: string }[]) => {
    if (!selectedSchool) return;
    try {
      await editKompetensi(selectedSchool.id, kode, unit_kompetensi);
      fetchKompetensi();
    } catch (err) {
      setError('Gagal mengedit kompetensi. Silakan coba lagi.');
    }
  };

  const handleDeleteKompetensi = async (kompetensiId: string) => {
    if (!selectedSchool) return;
    try {
      await deleteKompetensiById(selectedSchool.id, kompetensiId);
      fetchKompetensi();
    } catch (err) {
      setError('Gagal menghapus kompetensi. Silakan coba lagi.');
    }
  };

  const handleViewStat = async (kode: string) => {
    try {
      const data = await getAllSekolahStatByKodeOkupasi(kode);
      // Handle the data as required, e.g., setting state or displaying data
    } catch (err) {
      setError('Gagal memuat statistik sekolah. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 md:px-0">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-6xl">
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 mx-2 rounded ${activeTab === 'schools' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('schools')}
          >
            Sekolah
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded ${activeTab === 'kompetensi' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('kompetensi')}
          >
            Kompetensi
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            {activeTab === 'schools' ? (
              <SchoolFormComponent
                editId={editId}
                setEditId={setEditId}
                fetchSchools={fetchSchools}
                setError={setError}
              />
            ) : (
              <KompetensiFormComponent
                addKompetensi={handleAddKompetensi}
              />
            )}
          </div>
          <div className="w-full md:w-2/3">
            {activeTab === 'schools' ? (
              <SchoolListComponent
                schools={schools}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            ) : (
              <KompetensiListComponent
                kompetensi={kompetensi}
                handleEditKompetensi={handleEditKompetensi}
                handleDeleteKompetensi={handleDeleteKompetensi}
                handleViewStat={handleViewStat}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSekolahPage;
