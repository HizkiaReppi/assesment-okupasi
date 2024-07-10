import React, { useState, useEffect } from 'react';
import { editSekolahById } from '../../api/sekolah-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditSekolahFormProps {
    id: string;
    initialNama: string;
    initialKota: string;
    initialJumlahSiswa?: number;
    initialJumlahKelulusan?: number;
    onSuccess: () => void;
    onError: (message: string | string[]) => void;
}

const SekolahEditForm: React.FC<EditSekolahFormProps> = ({ id, initialNama, initialKota, initialJumlahSiswa = 0, initialJumlahKelulusan = 0, onSuccess }) => {
    const [nama, setNama] = useState<string>(initialNama || '');
    const [kota, setKota] = useState<string>(initialKota || '');
    const [jumlahSiswa, setJumlahSiswa] = useState<string>(initialJumlahSiswa.toString());
    const [jumlahKelulusan, setJumlahKelulusan] = useState<string>(initialJumlahKelulusan.toString());
    const [loading, setLoading] = useState<boolean>(false);
    const [isEdited, setIsEdited] = useState<boolean>(false);

    useEffect(() => {
        setNama(initialNama || '');
        setKota(initialKota || '');
        setJumlahSiswa(initialJumlahSiswa.toString());
        setJumlahKelulusan(initialJumlahKelulusan.toString());
    }, [initialNama, initialKota, initialJumlahSiswa, initialJumlahKelulusan]);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setter(value);
        setIsEdited(true);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await editSekolahById(id, nama, kota, parseInt(jumlahSiswa), parseInt(jumlahKelulusan));
            toast.success(`Sekolah ${nama} berhasil diupdate.`, {
                position: "bottom-right"
            });
            onSuccess();
            setIsEdited(false);
        } catch (error) {
            toast.error('Error updating Sekolah.', {
                position: "bottom-right"
            });
            console.error('Error updating Sekolah:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateNumber = (value: string) => {
        return /^[0-9]*$/.test(value);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Edit Sekolah</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-gray-300">Nama:</label>
                <input 
                    type="text" 
                    value={nama} 
                    onChange={(e) => handleInputChange(setNama, e.target.value)} 
                    className={`w-full p-3 border ${isEdited ? 'border-blue-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-gray-300">Kota:</label>
                <input 
                    type="text" 
                    value={kota} 
                    onChange={(e) => handleInputChange(setKota, e.target.value)} 
                    className={`w-full p-3 border ${isEdited ? 'border-blue-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-gray-300">Jumlah Siswa:</label>
                <input 
                    type="text" 
                    value={jumlahSiswa} 
                    onChange={(e) => validateNumber(e.target.value) && handleInputChange(setJumlahSiswa, e.target.value)} 
                    className={`w-full p-3 border ${isEdited ? 'border-blue-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2 dark:text-gray-300">Jumlah Kelulusan:</label>
                <input 
                    type="text" 
                    value={jumlahKelulusan} 
                    onChange={(e) => validateNumber(e.target.value) && handleInputChange(setJumlahKelulusan, e.target.value)} 
                    className={`w-full p-3 border ${isEdited ? 'border-blue-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
                />
            </div>
            <button 
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 ease-in-out dark:bg-white dark:text-black dark:hover:bg-gray-300"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Simpan'}
            </button>
        </form>
    );
};

export default SekolahEditForm;
