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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Okupasi</h2>
            <ul className="list-none">
                {okupasi.map((item) => (
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
        </div>
    );
};

export default OkupasiList;
