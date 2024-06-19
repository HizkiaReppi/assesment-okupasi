import React, { useEffect, useState } from 'react';
import { getAllKompetensi, deleteKompetensiById } from '../../api/sekolah-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface KompetensiListProps {
    sekolahId: string;
    onEdit: (unitId: string, initialKode: string) => void;
    refresh: boolean;  
}

const KompetensiList: React.FC<KompetensiListProps> = ({ sekolahId, onEdit, refresh }) => {
    const [kompetensi, setKompetensi] = useState<{ id: string; kode: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllKompetensi(sekolahId);
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

        fetchData();
    }, [sekolahId, refresh]);

    const handleDelete = async (unitId: string) => {
        try {
            await deleteKompetensiById(sekolahId, unitId);
            setKompetensi(kompetensi.filter((unit) => unit.id !== unitId));
        } catch (error) {
            console.error('Error deleting Kompetensi:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Kompetensi</h3>
            {kompetensi.length > 0 ? (
                <ul className="list-none">
                    {kompetensi.map((unit) => (
                        <li key={unit.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
                            <span className="block text-gray-800 font-semibold">{unit.kode}</span>
                            <div className="flex items-center">
                                <button
                                    onClick={() => onEdit(unit.id, unit.kode)}
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
                <p>No kompetensi found.</p>
            )}
        </div>
    );
};

export default KompetensiList;
