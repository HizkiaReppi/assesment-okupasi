import React, { useEffect, useState } from 'react';
import { getOkupasiByKode, deleteUnitKompetensi } from '../../api/okupasi-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface UnitKompetensiListProps {
    kode: string;
    onEdit: (unitId: string, initialNama: string) => void;
    refresh: boolean;
    editingUnitId?: string | null; // Optional prop for editing unit ID
}

const UnitKompetensiList: React.FC<UnitKompetensiListProps> = ({ kode, onEdit, refresh, editingUnitId }) => {
    const [unitKompetensi, setUnitKompetensi] = useState<{ id: string; nama: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const data = await getOkupasiByKode(kode);
                if (data && data.data && Array.isArray(data.data.unit_kompetensi)) {
                    setUnitKompetensi(data.data.unit_kompetensi);
                } else {
                    console.error('Invalid data format:', data);
                }
            } catch (error) {
                console.error('Error fetching unit kompetensi:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [kode, refresh]);

    const handleDelete = async (unitId: string) => {
        try {
            await deleteUnitKompetensi(kode, unitId);
            setUnitKompetensi(unitKompetensi.filter((unit) => unit.id !== unitId));
        } catch (error) {
            console.error('Error deleting Unit Kompetensi:', error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
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
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Unit Kompetensi</h3>
            <input
                type="text"
                placeholder="Cari unit kompetensi"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <p className="text-sm text-gray-600 mb-4">
                Total Items: {filteredUnits.length} | Page: {currentPage} of {totalPages}
            </p>
            {currentItems.length > 0 ? (
                <ul className="list-none">
                    {currentItems.map((unit) => (
                        <li key={unit.id} className={`mb-4 p-4 rounded-lg shadow-sm flex justify-between items-center ${editingUnitId === unit.id ? 'bg-yellow-100' : 'bg-gray-50'}`}>
                            <span className="block text-gray-800 font-semibold">{unit.nama}</span>
                            <div className="flex items-center">
                                <button
                                    onClick={() => onEdit(unit.id, unit.nama)}
                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                    title="Edit"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDelete(unit.id)}
                                    className="text-red-500 hover:text-red-700"
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

export default UnitKompetensiList;
