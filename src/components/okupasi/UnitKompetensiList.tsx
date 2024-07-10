import React, { useEffect, useState } from 'react';
import { getOkupasiByKode, deleteUnitKompetensi } from '../../api/okupasi-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UnitKompetensiListProps {
  kode: string;
  okupasiName: string; // New prop for okupasi name
  onEdit: (unitId: string, initialNama: string) => void;
  refresh: boolean;
  editingUnitId?: string | null;
}

const UnitKompetensiList: React.FC<UnitKompetensiListProps> = ({ kode, okupasiName, onEdit, refresh, editingUnitId }) => {
  const [unitKompetensi, setUnitKompetensi] = useState<{ id: string; nama: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState(''); // State untuk input pencarian sementara
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<{ id: string; nama: string } | null>(null);
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
        setUnitKompetensi(unitKompetensi.filter((unit) => unit.id !== selectedUnit.id));
        toast.error(`Unit kompetensi ${selectedUnit.nama} berhasil dihapus.`, {
          position: "bottom-right"
        });
        setShowModal(false);
        setSelectedUnit(null);
      } catch (error) {
        console.error('Error deleting Unit Kompetensi:', error);
      }
    }
  };

  const confirmDelete = (unit: { id: string; nama: string }) => {
    setSelectedUnit(unit);
    setShowModal(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update searchTerm ketika input berubah
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm); // Set searchQuery ketika tombol ditekan
    setCurrentPage(1); // Reset ke halaman pertama
  };

  const handleClearSearch = () => {
    setSearchTerm(''); // Clear search term
    setSearchQuery(''); // Clear search query
    setCurrentPage(1); // Reset ke halaman pertama
  };

  const filteredUnits = unitKompetensi.filter((unit) =>
    unit.nama.toLowerCase().includes(searchQuery.toLowerCase())
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
    return <p>Loading...</p>;
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Daftar Unit Kompetensi - {okupasiName}</h3> {/* Display okupasi name */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Cari unit kompetensi"
          value={searchTerm} // Bind ke searchTerm
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Search
        </button>
        <button
          onClick={handleClearSearch}
          className="ml-2 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          Batalkan Pencarian
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
        Total Items: {filteredUnits.length} | Page: {currentPage} of {totalPages}
      </p>
      {currentItems.length > 0 ? (
        <ul className="list-none">
          {currentItems.map((unit) => (
            <li key={unit.id} className={`mb-4 p-4 rounded-lg shadow-sm flex justify-between items-center ${editingUnitId === unit.id ? 'bg-yellow-100 dark:bg-yellow-200' : 'bg-gray-50 dark:bg-gray-700'}`}>
              <span className="block text-gray-800 font-semibold dark:text-white">{unit.nama}</span>
              <div className="flex items-center">
                <button
                  onClick={() => onEdit(unit.id, unit.nama)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 mr-2"
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => confirmDelete(unit)}
                  className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-500"
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No unit competencies found.</p>
      )}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'}`}
        >
          Next
        </button>
      </div>
      <ConfirmationModal
        isOpen={showModal}
        message={`Are you sure you want to delete ${selectedUnit?.nama}?`}
        onConfirm={handleDelete}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default UnitKompetensiList;
