import React, { useEffect, useState } from 'react';
import { getOkupasiByKode, deleteUnitKompetensi } from '../../api/okupasi-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface UnitKompetensiListProps {
    kode: string;
    onEdit: (unitId: string, initialNama: string) => void;
    refresh: boolean;  
}

const UnitKompetensiList: React.FC<UnitKompetensiListProps> = ({ kode, onEdit, refresh }) => {
    const [unitKompetensi, setUnitKompetensi] = useState<{ id: string; nama: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Unit Kompetensi</h3>
            {unitKompetensi.length > 0 ? (
                <ul className="list-none">
                    {unitKompetensi.map((unit) => (
                        <li key={unit.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center">
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
        </div>
    );
};

export default UnitKompetensiList;
