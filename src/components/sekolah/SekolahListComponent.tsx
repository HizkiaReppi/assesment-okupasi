import React, { useEffect, useState } from 'react';
import { getAllSekolah, deleteSekolahById } from '../../api/sekolah-api';
import { FaSearch, FaArrowLeft } from "react-icons/fa";
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
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [inputSearchTerm, setInputSearchTerm] = useState<string>('');
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const kota = selectedCities.length ? selectedCities.join(',') : undefined;
                const data = await getAllSekolah(searchTerm, itemsPerPage, currentPage, kota);
                if (data && Array.isArray(data.data)) {
                    setSekolah(data.data);
                    setTotalPages(data.total_page);
                    setTotalItems(data.total_result);
                }
            } catch (error) {
                console.error('Error fetching Sekolah:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refresh, currentPage, searchTerm, selectedCities]);

    const handleDelete = async (id: string) => {
        setDeleteId(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteSekolahById(deleteId);
            setSekolah(sekolah.filter((item) => item.id !== deleteId));
            toast.success('Sekolah berhasil dihapus.', {
                position: "bottom-right"
            });
        } catch (error) {
            toast.error('Error deleting Sekolah.', {
                position: "bottom-right"
            });
            console.error('Error deleting Sekolah:', error);
        } finally {
            setIsModalOpen(false);
            setDeleteId(null);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page on search change
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedCities((prev) =>
            checked ? [...prev, value] : prev.filter((city) => city !== value)
        );
        setCurrentPage(1); // Reset to the first page on filter change
    };

    const toggleFilterVisibility = () => {
        setFilterVisible(!filterVisible);
    };

    const handleSearchClick = () => {
        setSearchTerm(inputSearchTerm);
        setCurrentPage(1);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleBackClick = () => {
        setInputSearchTerm('');
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const uniqueCities = Array.from(new Set(sekolah.map((item) => item.kota)));

    if (loading) {
        return <p>Loading...</p>;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Sekolah</h2>
            {searchTerm && (
                <div className="mb-4">
                    <button
                        onClick={handleBackClick}
                        className="flex items-center mb-2 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        <FaArrowLeft className="mr-2" /> Back
                    </button>
                </div>
            )}
            <div className="mb-4 flex">
                <div className="flex-grow">
                    <label htmlFor="search" className="block text-gray-700">Search by Name:</label>
                    <input
                        type="text"
                        id="search"
                        value={inputSearchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyPress}
                        className="mt-1 p-2 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm"
                    />
                </div>
                <button
                    onClick={handleSearchClick}
                    className="ml-2 mt-6 p-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    <FaSearch />
                </button>
            </div>
            <div className="mb-4">
                <button onClick={toggleFilterVisibility} className="text-gray-700 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 14.414V18a1 1 0 01-.553.894l-4 2A1 1 0 018 20v-5.586L3.293 6.707A1 1 0 013 6V4z"></path>
                    </svg>
                    Filter by City
                </button>
                {filterVisible && (
                    <div className="mt-2">
                        {uniqueCities.map((city) => (
                            <div key={city}>
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        value={city}
                                        checked={selectedCities.includes(city)}
                                        onChange={handleCityChange}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">{city}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                    Data {startItem} - {endItem} dari {totalItems}
                </p>
            </div>
            <ul className="list-none">
                {sekolah.map((item) => (
                    <li
                        key={item.id}
                        className={`mb-4 p-4 rounded-lg shadow-sm ${editingId === item.id ? 'bg-yellow-100' : 'bg-gray-50'}`} 
                    >
                        <span className="block text-gray-900 font-semibold">{item.nama}</span>
                        <span className="block text-gray-600">{item.kota}</span>
                        <div className="mt-2 flex justify-end space-x-2">
                            <button onClick={() => onEdit(item.id, item.nama, item.kota)} className="text-sm bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400">
                                Edit
                            </button>
                            <button onClick={() => onViewKompetensi(item.id)} className="text-sm bg-blue-300 px-3 py-1 rounded-md hover:bg-blue-400">
                                Cek Kompetensi
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-sm bg-red-300 px-3 py-1 rounded-md hover:bg-red-400">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                >
                    Previous
                </button>
                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageClick(i + 1)}
                            className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                >
                    Next
                </button>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
                message="Yakin untuk menghapus item ini?"
            />
        </div>
    );
};

export default SekolahList;
