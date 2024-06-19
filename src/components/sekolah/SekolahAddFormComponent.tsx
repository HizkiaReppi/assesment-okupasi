import React, { useState } from 'react';
import { addSekolah, addKompetensi } from '../../api/sekolah-api';

interface SekolahAddFormProps {
    onAddSuccess: () => void;
}

const SekolahAddForm: React.FC<SekolahAddFormProps> = ({ onAddSuccess }) => {
    const [nama, setNama] = useState('');
    const [kota, setKota] = useState('');
    const [kompetensi, setKompetensi] = useState([{ id: '' }]);
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
            const sekolah = await addSekolah(nama, kota);
            const sekolahId = sekolah.id;

            // Add Kompetensi to the created Sekolah
            for (const unit of kompetensi) {
                await addKompetensi(sekolahId, unit.id, [unit]);
            }

            setNama('');
            setKota('');
            setKompetensi([{ id: '' }]);
            setError(null);
            onAddSuccess();
        } catch (error) {
            console.error('Error adding Sekolah or Kompetensi:', error);
            setError('Gagal menambahkan sekolah atau kompetensi. Silakan coba lagi.');
        }
    };

    const handleKompetensiChange = (index: number, value: string) => {
        const updatedKompetensi = kompetensi.map((unit, i) =>
            i === index ? { id: value } : unit
        );
        setKompetensi(updatedKompetensi);
    };

    const addKompetensiField = () => {
        setKompetensi([...kompetensi, { id: '' }]);
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
            <div>
                <h3 className="text-md font-semibold text-black mt-4">Kompetensi</h3>
                {kompetensi.map((unit, index) => (
                    <div key={index} className="mt-2">
                        <label className="block text-gray-700">ID Kompetensi:</label>
                        <input
                            type="text"
                            value={unit.id}
                            onChange={(e) => handleKompetensiChange(index, e.target.value)}
                            className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm"
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addKompetensiField}
                    className="mt-2 text-black px-4 py-2 rounded-md hover:bg-gray-100"
                >
                    + Tambah Kompetensi
                </button>
            </div>
            <button type="submit" className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Simpan
            </button>
        </form>
    );
};

export default SekolahAddForm;
