import React, { useEffect, useState } from 'react';
import { getAllSekolah, deleteSekolahById } from '../../api/sekolah-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../ConfirmationModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEdit, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import BackToTopButton from '../BackToTopButton';
import KonsentrasiList from './KonsentrasiList';
import KonsentrasiAdd from './KonsentrasiAdd';

interface SekolahListProps {
    onEdit: (id: string, nama: string, kota: string, jumlah_siswa: number, jumlah_kelulusan: number) => void;
    onViewKompetensi: (id: string, nama: string) => void;
    refresh: boolean;
    editingId: string | null;
    onRefresh: () => void;
}

const SekolahList: React.FC<SekolahListProps> = ({ onEdit, onViewKompetensi, refresh, editingId, onRefresh }) => {
    const [sekolah, setSekolah] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showAddKonsentrasi, setShowAddKonsentrasi] = useState(false);
    const [selectedSekolahId, setSelectedSekolahId] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSekolah(searchQuery, itemsPerPage, currentPage);
                if (data && Array.isArray(data.data)) {
                    setSekolah(data.data);
                    setTotalItems(data.total_result);
                }
            } catch (error) {
                console.error('Error fetching Sekolah:', error);
            }
        };

        fetchData();
    }, [refresh, currentPage, searchQuery]);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteSekolahById(deleteId);
            const deletedItem = sekolah.find((item) => item.id === deleteId);
            setSekolah(sekolah.filter((item) => item.id !== deleteId));
            setTotalItems(totalItems - 1);
            toast.error(`Sekolah dengan nama ${deletedItem.nama} berhasil dihapus.`, {
                position: "bottom-right"
            });
            closeModal();
            onRefresh();
        } catch (error) {
            console.error('Error deleting Sekolah:', error);
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

    const handleAddKonsentrasi = (sekolahId: string) => {
        setSelectedSekolahId(sekolahId);
        setShowAddKonsentrasi(true);
    };

    const renderPagination = () => {
        const pageButtons = [];
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) return null;

        if (currentPage > 1) {
            pageButtons.push(
                <button
                    key="prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            );
        }

        if (currentPage > 2) {
            pageButtons.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    1
                </button>
            );
        }

        if (currentPage > 3) {
            pageButtons.push(<span key="dots1" className="px-3 py-1 mx-1">...</span>);
        }

        if (currentPage > 1) {
            pageButtons.push(
                <button
                    key={currentPage - 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    {currentPage - 1}
                </button>
            );
        }

        pageButtons.push(
            <button
                key={currentPage}
                className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-500 text-white dark:bg-gray-800 dark:text-white"
            >
                {currentPage}
            </button>
        );

        if (currentPage < totalPages) {
            pageButtons.push(
                <button
                    key={currentPage + 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    {currentPage + 1}
                </button>
            );
        }

        if (currentPage < totalPages - 2) {
            pageButtons.push(<span key="dots2" className="px-3 py-1 mx-1">...</span>);
        }

        if (currentPage < totalPages - 1) {
            pageButtons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    {totalPages}
                </button>
            );
        }

        if (currentPage < totalPages) {
            pageButtons.push(
                <button
                    key="next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            );
        }

        return pageButtons;
    };

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md relative dark:bg-gray-800 dark:text-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Daftar Sekolah</h2>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Cari nama sekolah"
                    value={searchTerm}
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
                    Batalkan
                </button>
            </div>
            <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
                Data {itemsPerPage * (currentPage - 1) + 1} - {Math.min(itemsPerPage * currentPage, totalItems)} dari {totalItems}
            </p>
            <ul className="list-none">
                {sekolah.map((item) => (
                    <li
                        key={item.id}
                        className={`mb-4 p-4 bg-gray-50 rounded-lg shadow-sm ${editingId === item.id ? 'bg-yellow-100' : 'bg-gray-50 dark:bg-gray-700'}`}
                    >
                        <span className="block text-gray-900 font-semibold mb-2 dark:text-white">
                            {item.nama.toUpperCase()} <br />
                            Kota: {item.kota} <br />
                            <KonsentrasiList
                                sekolahId={item.id}
                                konsentrasi={item.konsentrasi || []}
                                onRefresh={onRefresh}
                            />
                            Jumlah Siswa: {item.jumlah_siswa} <br />
                            Jumlah Kelulusan: {item.jumlah_kelulusan} ({formatPercentage(item.jumlah_kelulusan, item.jumlah_siswa)})
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2 justify-end">
                            <button 
                                onClick={() => onEdit(item.id, item.nama, item.kota, item.jumlah_siswa, item.jumlah_kelulusan)} 
                                className="relative overflow-hidden text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                            </button>
                            <button 
                                onClick={() => handleAddKonsentrasi(item.id)}
                                className="relative overflow-hidden text-sm bg-blue-300 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-400 dark:bg-blue-600 dark:text-blue-200 dark:hover:bg-blue-500"
                            >
                                <FontAwesomeIcon icon={faGraduationCap} className="mr-1" /> Edit Konsentrasi
                            </button>
                            <button 
                                onClick={() => onViewKompetensi(item.id, item.nama)}
                                className="relative overflow-hidden text-sm bg-green-300 text-green-800 px-3 py-1 rounded-md hover:bg-green-400 dark:bg-green-600 dark:text-green-200 dark:hover:bg-green-500"
                            >
                                Cek Kompetensi
                            </button>
                            <button 
                                onClick={() => openModal(item.id)} 
                                className="relative overflow-hidden text-sm bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 dark:bg-red-600 dark:text-red-200 dark:hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4 flex justify-center">
                {renderPagination()}
            </div>
            <BackToTopButton />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDelete}
                message="Yakin untuk menghapus item ini?"
            />
            {showAddKonsentrasi && selectedSekolahId && (
                <KonsentrasiAdd
                    sekolahId={selectedSekolahId}
                    onClose={() => setShowAddKonsentrasi(false)}
                    onSuccess={() => {
                        setShowAddKonsentrasi(false);
                        onRefresh();
                    }}
                />
            )}
        </div>
    );
};

const formatPercentage = (numerator: number, denominator: number): string => {
    if (denominator === 0) return '0%';
    return ((numerator / denominator) * 100).toFixed(2) + '%';
};

export default SekolahList;