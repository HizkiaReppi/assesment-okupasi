import React, { useState } from 'react';
import { addUnitKompetensi } from '../../api/okupasi-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UnitKompetensiAddFormProps {
    kode: string;
    onSuccess: () => void;
}

const UnitKompetensiAddForm: React.FC<UnitKompetensiAddFormProps> = ({ kode, onSuccess }) => {
    const [nama, setNama] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await addUnitKompetensi(kode, nama);
            setNama('');
            toast.success(`Unit kompetensi ${nama} berhasil ditambahkan.`, {
                position: "bottom-right"
            });
            onSuccess();
        } catch (error) {
            toast.error('Gagal menambahkan unit kompetensi.', {
                position: "bottom-right"
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tambah Unit Kompetensi</h3>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama:</label>
                <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)} 
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

export default UnitKompetensiAddForm;
