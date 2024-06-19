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
    const [isEdited, setIsEdited] = useState<boolean>(false);  

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

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setter(value);
        setIsEdited(true);  
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            console.log('Updating Sekolah:', { id, nama, kota });
            await editSekolahById(id, nama, kota);
            onSuccess();
            setIsEdited(false);  
        } catch (error) {
            console.error('Error updating Sekolah:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Sekolah</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama:</label>
                <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => handleInputChange(setNama, e.target.value)} 
                    className={`w-full p-3 border ${isEdited ? 'border-blue-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out`}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kota:</label>
                <input 
                    type="text" 
                    value={kota} 
                    onChange={(e) => handleInputChange(setKota, e.target.value)} 
                    className={`w-full p-3 border ${isEdited ? 'border-blue-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out`}
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
