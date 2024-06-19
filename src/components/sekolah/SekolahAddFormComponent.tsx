import React, { useState } from 'react';
import { addSekolah } from '../../api/sekolah-api';

interface SekolahAddFormProps {
    onAddSuccess: () => void;
}

const SekolahAddForm: React.FC<SekolahAddFormProps> = ({ onAddSuccess }) => {
    const [nama, setNama] = useState('');
    const [kota, setKota] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (nama.trim() === '') {
            setError('Nama tidak boleh kosong.');
            return;
        }

        if (kota.trim() === '') {
            setError('Kota tidak boleh kosong.');
            return;
        }

        try {
            await addSekolah(nama, kota);

            setNama('');
            setKota('');
            setError(null);
            onAddSuccess();
        } catch (error) {
            console.error('Error adding Sekolah:', error);
            setError('Gagal menambahkan sekolah. Silakan coba lagi.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-black mb-4">Tambah Sekolah</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div>
                <label className="block text-gray-700">Nama:</label>
                <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm"
                />
            </div>
            <div>
                <label className="block text-gray-700">Kota:</label>
                <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm"
                />
            </div>
            <button type="submit" className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Simpan
            </button>
        </form>
    );
};

export default SekolahAddForm;
