import React, { useState } from 'react';
import { addUnitKompetensi } from '../../api/okupasi-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UnitKompetensiAddFormProps {
    kode: string;
    onSuccess: () => void;
}

const UnitKompetensiAddForm: React.FC<UnitKompetensiAddFormProps> = ({ kode, onSuccess }) => {
    const [kodeUnit, setKodeUnit] = useState('');
    const [nama, setNama] = useState('');
    const [standardKompetensi, setStandardKompetensi] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await addUnitKompetensi(kode, { kode_unit: kodeUnit, nama, standard_kompetensi: standardKompetensi });
            setKodeUnit('');
            setNama('');
            setStandardKompetensi('');
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
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
            <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Tambah Unit Kompetensi</h3>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-gray-300">Kode Unit:</label>
                <input 
                    type="text" 
                    value={kodeUnit} 
                    onChange={(e) => setKodeUnit(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-gray-500"
                    placeholder="Masukkan kode unit"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-white">Nama:</label>
                <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => setNama(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-gray-500"
                    placeholder="Masukkan nama unit kompetensi"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-white">Standard Kompetensi:</label>
                <textarea 
                    value={standardKompetensi} 
                    onChange={(e) => setStandardKompetensi(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-gray-500"
                    placeholder="Masukkan standard kompetensi"
                    rows={3}
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

export default UnitKompetensiAddForm;