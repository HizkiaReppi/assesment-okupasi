import React, { useEffect, useState } from 'react';
import { getOkupasiByKode, deleteUnitKompetensi } from '../../api/okupasi-api';

interface UnitKompetensiListProps {
    kode: string;
    onEdit: (unitId: string, initialNama: string) => void;
}

const UnitKompetensiList: React.FC<UnitKompetensiListProps> = ({ kode, onEdit }) => {
    const [unitKompetensi, setUnitKompetensi] = useState<{ id: string; nama: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching Unit Kompetensi for Okupasi with kode:', kode);
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
    }, [kode]);

    const handleDelete = async (unitId: string) => {
        console.log('Deleting Unit Kompetensi with id:', unitId);
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
            <h3 className="text-lg font-bold text-orange-500 mb-4">Daftar Unit Kompetensi</h3>
            {unitKompetensi.length > 0 ? (
                <ul className="list-none">
                    {unitKompetensi.map((unit) => (
                        <li key={unit.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                            <span className="block text-gray-800 font-semibold">{unit.nama}</span>
                            <div className="mt-2">
                                <button
                                    onClick={() => onEdit(unit.id, unit.nama)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(unit.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Hapus
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Tidak ada unit kompetensi yang ditemukan.</p>
            )}
        </div>
    );
};

export default UnitKompetensiList;
