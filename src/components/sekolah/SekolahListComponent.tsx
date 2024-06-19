import React, { useEffect, useState } from 'react';
import { getAllSekolah, deleteSekolahById } from '../../api/sekolah-api';

interface SekolahListProps {
    onEdit: (id: string) => void;
    onViewKompetensi: (id: string) => void;
    refresh: boolean;
    editingId: string | null;
}

const SekolahList: React.FC<SekolahListProps> = ({ onEdit, onViewKompetensi, refresh, editingId }) => {
    const [sekolah, setSekolah] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('Fetching all Sekolah');
                const data = await getAllSekolah();
                if (data && Array.isArray(data.data)) {
                    setSekolah(data.data);
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error('Error fetching Sekolah:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refresh]);

    const handleDelete = async (id: string) => {
        console.log('Deleting Sekolah with id:', id);
        try {
            await deleteSekolahById(id);
            setSekolah(sekolah.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting Sekolah:', error);
        }
    };

    // Pagination functions
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sekolah.slice(indexOfFirstItem, indexOfLastItem);

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Sekolah</h2>
            <div>
                <label htmlFor="itemsPerPage">Items per Page:</label>
                <input
                    type="number"
                    className='ml-2 font-bold'
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                />
            </div>
            <ul className="list-none">
                {currentItems.map((item) => (
                    <li
                        key={item.id}
                        className={`mb-4 p-4 rounded-lg shadow-sm ${editingId === item.id ? 'bg-yellow-100' : 'bg-gray-50'}`} // Highlight item yang sedang diedit
                    >
                        <span className="block text-gray-900 font-semibold">{item.nama}</span>
                        <span className="block text-gray-600">{item.kota}</span>
                        <div className="mt-2 flex justify-end space-x-2">
                            <button onClick={() => onEdit(item.id)} className="text-sm bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400">
                                Edit
                            </button>
                            <button onClick={() => onViewKompetensi(item.id)} className="text-sm bg-blue-300 px-3 py-1 rounded-md hover:bg-blue-400">
                                View Kompetensi
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-sm bg-red-300 px-3 py-1 rounded-md hover:bg-red-400">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(sekolah.length / itemsPerPage) }, (_, i) => (
                    <button key={i} onClick={() => changePage(i)} className={`px-3 py-1 mx-1 ${currentPage === i ? 'bg-blue-700 text-white' : 'bg-blue-300'}`}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SekolahList;
