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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCities, setSelectedCities] = useState<string[]>([]);
    const [filterVisible, setFilterVisible] = useState<boolean>(false);

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

    // Handle search term change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Handle city filter change
    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setSelectedCities((prev) =>
            checked ? [...prev, value] : prev.filter((city) => city !== value)
        );
    };

    // Toggle filter visibility
    const toggleFilterVisibility = () => {
        setFilterVisible(!filterVisible);
    };

    // Filter items based on search term and selected cities
    const filteredItems = sekolah.filter((item) => {
        const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCities.length === 0 || selectedCities.includes(item.kota);
        return matchesSearch && matchesCity;
    });

    // Pagination functions
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const uniqueCities = Array.from(new Set(sekolah.map((item) => item.kota)));

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Sekolah</h2>
            <div className="mb-4">
                <label htmlFor="search" className="block text-gray-700">Search by Name:</label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mt-1 p-2 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm"
                />
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
                {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
                    <button key={i} onClick={() => changePage(i)} className={`px-3 py-1 mx-1 ${currentPage === i ? 'bg-blue-700 text-white' : 'bg-blue-300'}`}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SekolahList;
