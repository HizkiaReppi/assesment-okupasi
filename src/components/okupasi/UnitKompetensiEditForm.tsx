import React, { useState } from 'react';
import { updateUnitKompetensi } from '../../api/okupasi-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UnitKompetensiEditFormProps {
    kode: string;
    unitId: string;
    initialNama: string;
    onSuccess: (updated: boolean) => void;
}

const UnitKompetensiEditForm: React.FC<UnitKompetensiEditFormProps> = ({ kode, unitId, initialNama, onSuccess }) => {
    const [nama, setNama] = useState(initialNama);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await updateUnitKompetensi(kode, unitId, nama);
            toast.info(`Unit kompetensi ${nama} berhasil diupdate.`, {
                position: "bottom-right"
            });
            onSuccess(true);  
        } catch (error) {
            toast.error('Gagal mengupdate unit kompetensi.', {
                position: "bottom-right"
            });
            onSuccess(false);  
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Edit Unit Kompetensi</h3>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-gray-300">Nama:</label>
                <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:focus:border-gray-500 dark:text-white" 
                />
            </div>
            <button 
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-800"
            >
                Simpan
            </button>
        </form>
    );
};

export default UnitKompetensiEditForm;
