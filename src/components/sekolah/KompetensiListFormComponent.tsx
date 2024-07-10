import React, { useEffect, useState } from 'react';
import { getAllKompetensi, deleteKompetensiById, deleteKompetensiByKodeOkupasi } from '../../api/sekolah-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../ConfirmationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface KompetensiListProps {
    sekolahId: string;
    schoolName: string; // New prop for school name
    okupasiName: string; // New prop for okupasi name
    onEdit: (unitId: string, initialKode: string) => void;
    refresh: boolean;
    editingUnitId: string | null;
}

const KompetensiList: React.FC<KompetensiListProps> = ({ sekolahId, schoolName, okupasiName, onEdit, refresh, editingUnitId }) => {
    const [kompetensi, setKompetensi] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; kode?: string } | null>(null);
    const itemsPerPage = 5;

    const fetchData = async (search = '') => {
        setLoading(true);
        try {
            const data = await getAllKompetensi(sekolahId, search, itemsPerPage, currentPage);
            if (data && Array.isArray(data.data)) {
                setKompetensi(data.data);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching kompetensi:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(searchTerm);
    }, [sekolahId, refresh, currentPage]);

    const handleDelete = async () => {
        if (selectedItem) {
            try {
                if (selectedItem.kode) {
                    await deleteKompetensiByKodeOkupasi(sekolahId, selectedItem.kode);
                    toast.success('Kompetensi dengan kode berhasil dihapus.', {
                        position: "bottom-right"
                    });
                } else {
                    await deleteKompetensiById(sekolahId, selectedItem.id);
                    toast.success('Kompetensi berhasil dihapus.', {
                        position: "bottom-right"
                    });
                }
                fetchData(searchTerm);
                setShowModal(false);
                setSelectedItem(null);
            } catch (error) {
                toast.error('Gagal menghapus kompetensi.', {
                    position: "bottom-right"
                });
                console.error('Error deleting Kompetensi:', error);
            }
        }
    };

    const confirmDelete = (item: { id: string; kode?: string }) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page when search query changes
        fetchData(searchTerm);
        setIsSearchPerformed(true);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchData('');
        setIsSearchPerformed(false);
    };

    const totalPages = Math.ceil(kompetensi.length / itemsPerPage);

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Daftar Kompetensi - {schoolName} - {okupasiName}</h3>
            <div className="mb-4">
                <div className="flex mb-3">
                    <input
                        type="text"
                        placeholder="Search by Kode or Nama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-l-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                        onClick={handleSearch}
                        className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                {isSearchPerformed && (
                    <button
                        onClick={handleClearSearch}
                        className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </button>
                )}
            </div>
            {kompetensi.length > 0 ? (
                <ul className="list-none">
                    {kompetensi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                        <li key={item.kode} className={`mb-4 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-700 ${editingUnitId === item.kode ? 'border border-yellow-500' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-gray-800 font-semibold dark:text-white">{item.kode}</span>
                                    <span className="block text-gray-600 dark:text-gray-300">{item.nama}</span>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => confirmDelete({ id: item.kode, kode: item.kode })}
                                        className="text-red-500 hover:text-red-700 mr-2"
                                        title="Delete by Kode"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(item.kode, item.unit_kompetensi.length > 0 ? item.unit_kompetensi[0].id : '')}
                                        className="text-blue-500 hover:text-blue-700"
                                        title="Edit"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </div>
                            </div>
                            {item.unit_kompetensi.map((unit: any) => (
                                <div key={unit.id} className="flex items-center mt-1 ml-8">
                                    <button
                                        onClick={() => confirmDelete({ id: unit.id })}
                                        className="text-red-500 hover:text-red-700 mr-2"
                                        title="Delete by Id"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <span className="text-gray-600 dark:text-gray-300">{unit.nama}</span>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="dark:text-white">No kompetensi found.</p>
            )}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                        currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                    }`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => changePage(i + 1)}
                        className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                            currentPage === i + 1 ? 'bg-gray-500 text-white dark:bg-gray-800' : 'bg-blue-300 hover:bg-blue-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                        currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                    }`}
                >
                    Next
                </button>
            </div>
            <ConfirmationModal
                isOpen={showModal}
                message={`Are you sure you want to delete ${selectedItem?.kode ? 'Kode ' + selectedItem.kode : 'Unit ' + selectedItem?.id}?`}
                onConfirm={handleDelete}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

export default KompetensiList;
