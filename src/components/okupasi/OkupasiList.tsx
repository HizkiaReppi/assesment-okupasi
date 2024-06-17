import React, { useEffect, useState } from 'react';
import { getAllOkupasi, deleteOkupasi } from '../../api/okupasi-api';

interface OkupasiListProps {
    onEdit: (kode: string) => void;
    onViewUnits: (kode: string) => void;
    refresh: boolean;
}

const OkupasiList: React.FC<OkupasiListProps> = ({ onEdit, onViewUnits, refresh }) => {
    const [okupasi, setOkupasi] = useState<any[]>([]);

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

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-orange-500 mb-4">Daftar Okupasi</h2>
            <ul className="list-none">
                {okupasi.map((item) => (
                    <li key={item.kode} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                        <span className="block text-gray-800 font-semibold">{item.nama}</span>
                        <div className="mt-2">
                            <button 
                                onClick={() => onEdit(item.kode)} 
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => onViewUnits(item.kode)} 
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
                            >
                                Lihat Unit Kompetensi
                            </button>
                            <button 
                                onClick={() => handleDelete(item.kode)} 
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Hapus
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OkupasiList;
