import React, { useState, useEffect } from 'react';
import { getOkupasiByKode, updateOkupasi } from '../../api/okupasi-api';

interface EditOkupasiFormProps {
    kode: string;
    onSuccess: () => void;
}

const OkupasiEditForm: React.FC<EditOkupasiFormProps> = ({ kode, onSuccess }) => {
    const [nama, setNama] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching Okupasi by kode:', kode);
                const data = await getOkupasiByKode(kode);
                setNama(data.data.nama || '');
            } catch (error) {
                console.error('Error fetching Okupasi:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [kode]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            console.log('Updating Okupasi:', { kode, nama });
            await updateOkupasi(kode, nama);
            onSuccess();
        } catch (error) {
            console.error('Error updating Okupasi:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-orange-500 mb-4">Edit Okupasi</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama:</label>
                <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)} 
                    className="w-full p-2 border border-gray-300 rounded-md" 
                />
            </div>
            <button 
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
                Simpan
            </button>
        </form>
    );
};

export default OkupasiEditForm;
