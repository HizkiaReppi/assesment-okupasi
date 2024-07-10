import React, { useState } from 'react';
import { addSekolah } from '../../api/sekolah-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SekolahAddFormProps {
    onAddSuccess: () => void;
}

const SekolahAddForm: React.FC<SekolahAddFormProps> = ({ onAddSuccess }) => {
    const [nama, setNama] = useState('');
    const [kota, setKota] = useState('');
    const [jumlahSiswa, setJumlahSiswa] = useState('');
    const [jumlahKelulusan, setJumlahKelulusan] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validateNumber = (value: string) => {
        return /^[0-9]*$/.test(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (nama.trim() === '') {
            setError('Nama tidak boleh kosong.');
            toast.error('Nama tidak boleh kosong.', {
                position: "bottom-right"
            });
            return;
        }

        if (kota.trim() === '') {
            setError('Kota tidak boleh kosong.');
            toast.error('Kota tidak boleh kosong.', {
                position: "bottom-right"
            });
            return;
        }

        if (jumlahSiswa.trim() === '' || !validateNumber(jumlahSiswa)) {
            setError('Jumlah siswa harus berupa angka dan tidak boleh kosong.');
            toast.error('Jumlah siswa harus berupa angka dan tidak boleh kosong.', {
                position: "bottom-right"
            });
            return;
        }

        if (jumlahKelulusan.trim() === '' || !validateNumber(jumlahKelulusan)) {
            setError('Jumlah kelulusan harus berupa angka dan tidak boleh kosong.');
            toast.error('Jumlah kelulusan harus berupa angka dan tidak boleh kosong.', {
                position: "bottom-right"
            });
            return;
        }

        try {
            await addSekolah(nama, kota, parseInt(jumlahSiswa), parseInt(jumlahKelulusan));

            setNama('');
            setKota('');
            setJumlahSiswa('');
            setJumlahKelulusan('');
            setError(null);
            onAddSuccess();
            toast.success(`Sekolah ${nama} berhasil ditambahkan.`, {
                position: "bottom-right"
            });
        } catch (error) {
            console.error('Error adding Sekolah:', error);
            setError('Gagal menambahkan sekolah. Silakan coba lagi.');
            toast.error('Gagal menambahkan sekolah. Silakan coba lagi.', {
                position: "bottom-right"
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-lg font-bold text-black mb-4 dark:text-white">Tambah Sekolah</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Nama:</label>
                <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Kota:</label>
                <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Jumlah Siswa:</label>
                <input
                    type="text"
                    value={jumlahSiswa}
                    onChange={(e) => validateNumber(e.target.value) && setJumlahSiswa(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Jumlah Kelulusan:</label>
                <input
                    type="text"
                    value={jumlahKelulusan}
                    onChange={(e) => validateNumber(e.target.value) && setJumlahKelulusan(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <button type="submit" className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300">
                Simpan
            </button>
        </form>
    );
};

export default SekolahAddForm;
