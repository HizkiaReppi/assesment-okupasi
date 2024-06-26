import React, { useEffect, useState } from 'react';
import { getAllSekolah, deleteSekolahById } from '../../api/sekolah-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from '../ConfirmationModal';

interface SekolahListProps {
    onEdit: (id: string, nama: string, kota: string) => void;
    onViewKompetensi: (id: string) => void;
    refresh: boolean;
    editingId: string | null;
}

const SekolahList: React.FC<SekolahListProps> = ({ onEdit, onViewKompetensi, refresh, editingId }) => {
    const [sekolah, setSekolah] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSekolah(searchQuery, itemsPerPage);
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
            toast.error(`Sekolah dengan nama ${deletedItem.nama} berhasil dihapus.`, {
                position: "bottom-right"
            });
            closeModal();
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
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Sekolah</h2>
            <input
                type="text"
                placeholder="Cari nama sekolah"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <p className="text-sm text-gray-600 mb-4">
                Data {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} dari {totalItems}
            </p>
            <ul className="list-none">
                {sekolah.map((item) => (
                    <li
                        key={item.id}
                        className={`mb-4 p-4 bg-gray-50 rounded-lg shadow-sm ${editingId === item.id ? 'bg-yellow-100' : 'bg-gray-50'}`}
                    >
                        <span className="block text-gray-900 font-semibold">
                            {item.nama} <br />
                            Kota: {item.kota}
                        </span>
                        <div className="mt-2 flex justify-end space-x-2">
                            <button 
                                onClick={() => onEdit(item.id, item.nama, item.kota)} 
                                className="relative overflow-hidden text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 before:absolute before:inset-0 before:bg-gray-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => onViewKompetensi(item.id)} 
                                className="relative overflow-hidden text-sm bg-blue-300 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-400 before:absolute before:inset-0 before:bg-blue-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
                            >
                                Cek Kompetensi
                            </button>
                            <button 
                                onClick={() => openModal(item.id)} 
                                className="relative overflow-hidden text-sm bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 before:absolute before:inset-0 before:bg-red-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                        currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                    }`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                            currentPage === i + 1 ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
                        currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                    }`}
                >
                    Next
                </button>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDelete}
                message="Yakin untuk menghapus item ini?"
            />
        </div>
    );
};

export default SekolahList;
