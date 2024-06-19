import React, { useState, useEffect } from 'react';
import { getSekolahById, editSekolahById } from '../../api/sekolah-api';

interface EditSekolahFormProps {
    id: string;
    onSuccess: () => void;
}

const SekolahEditForm: React.FC<EditSekolahFormProps> = ({ id, onSuccess }) => {
    const [nama, setNama] = useState<string>('');
    const [kota, setKota] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [editFlag, setEditFlag] = useState<boolean>(false);  // Flag untuk menandai sedang diedit

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching Sekolah by id:', id);
                const data = await getSekolahById(id);
                setNama(data.nama || '');
                setKota(data.kota || '');
            } catch (error) {
                console.error('Error fetching Sekolah:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            console.log('Updating Sekolah:', { id, nama, kota });
            await editSekolahById(id, nama, kota);
            onSuccess();
            setEditFlag(false);
        } catch (error) {
            console.error('Error updating Sekolah:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className={`mb-6 p-4 bg-white rounded-lg shadow-lg ${editFlag ? 'bg-yellow-100' : ''}`}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Sekolah</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama:</label>
                <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => { setNama(e.target.value); setEditFlag(true); }} 
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kota:</label>
                <input 
                    type="text" 
                    value={kota} 
                    onChange={(e) => { setKota(e.target.value); setEditFlag(true); }} 
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                />
            </div>
            <button 
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 ease-in-out"
            >
                Simpan
            </button>
        </form>
    );
};

export default SekolahEditForm;
