import React, { useEffect, useState } from 'react';
import { getAllOkupasi, deleteOkupasi } from '../../api/okupasi-api';

interface OkupasiListProps {
    onEdit: (kode: string) => void;
    onViewUnits: (kode: string) => void;
    refresh: boolean;
}

const OkupasiList: React.FC<OkupasiListProps> = ({ onEdit, onViewUnits, refresh }) => {
    const [okupasi, setOkupasi] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching all Okupasi');
            const data = await getAllOkupasi();
            if (Array.isArray(data.data)) {
                setOkupasi(data.data);
            } else {
                console.error('Data is not an array:', data);
            }
        };

        fetchData();
    }, [refresh]);

    const handleDelete = async (kode: string) => {
        console.log('Deleting Okupasi with kode:', kode);
        try {
            await deleteOkupasi(kode);
            setOkupasi(okupasi.filter((item) => item.kode !== kode));
        } catch (error) {
            console.error('Error deleting Okupasi:', error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    const filteredOkupasi = okupasi.filter((item) =>
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) || item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOkupasi.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredOkupasi.length / itemsPerPage);

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

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Okupasi</h2>
            <input
                type="text"
                placeholder="Cari kode atau nama okupasi"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <p className="text-sm text-gray-600 mb-4">
                Total Items: {filteredOkupasi.length} | Page: {currentPage} of {totalPages}
            </p>
            <ul className="list-none">
                {currentItems.map((item) => (
                    <li key={item.kode} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                        <span className="block text-gray-900 font-semibold">{item.nama}</span>
                        <div className="mt-2 flex justify-end space-x-2">
                            <button 
                                onClick={() => onEdit(item.kode)} 
                                className="relative overflow-hidden text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 before:absolute before:inset-0 before:bg-gray-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => onViewUnits(item.kode)} 
                                className="relative overflow-hidden text-sm bg-blue-300 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-400 before:absolute before:inset-0 before:bg-blue-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
                            >
                                View Units
                            </button>
                            <button 
                                onClick={() => handleDelete(item.kode)} 
                                className="relative overflow-hidden text-sm bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 before:absolute before:inset-0 before:bg-red-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative overflow-hidden text-sm px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OkupasiList;
