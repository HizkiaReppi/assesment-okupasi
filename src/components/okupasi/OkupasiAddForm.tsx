import React, { useState } from 'react';
import { addOkupasi } from '../../api/okupasi-api';

interface OkupasiAddFormProps {
    onAddSuccess: () => void;
}

const OkupasiAddForm: React.FC<OkupasiAddFormProps> = ({ onAddSuccess }) => {
    const [kode, setKode] = useState('');
    const [nama, setNama] = useState('');
    const [unitKompetensi, setUnitKompetensi] = useState([{ nama: '' }]);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!/^\d+$/.test(kode)) {
            setError('Kode harus berupa angka.');
            return;
        }

        if (nama.trim() === '') {
            setError('Nama tidak boleh kosong.');
            return;
        }

        try {
            await addOkupasi(kode, nama, unitKompetensi);
            setKode('');
            setNama('');
            setUnitKompetensi([{ nama: '' }]);
            setError(null);
            onAddSuccess();
        } catch (error) {
            console.error('Error adding Okupasi:', error);
            setError('Gagal menambahkan okupasi. Silakan coba lagi.');
        }
    };

    const handleUnitKompetensiChange = (index: number, value: string) => {
        const updatedUnits = unitKompetensi.map((unit, i) =>
            i === index ? { nama: value } : unit
        );
        setUnitKompetensi(updatedUnits);
    };

    const addUnitKompetensiField = () => {
        setUnitKompetensi([...unitKompetensi, { nama: '' }]);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-orange-500 mb-4">Tambah Okupasi</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div>
                <label className="block text-gray-700">Kode:</label>
                <input
                    type="text"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div>
                <label className="block text-gray-700">Nama:</label>
                <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            <div>
                <h3 className="text-md font-semibold text-orange-500 mt-4">Unit Kompetensi</h3>
                {unitKompetensi.map((unit, index) => (
                    <div key={index} className="mt-2">
                        <label className="block text-gray-700">Nama:</label>
                        <input
                            type="text"
                            value={unit.nama}
                            onChange={(e) => handleUnitKompetensiChange(index, e.target.value)}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addUnitKompetensiField}
                    className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                    Tambah Unit Kompetensi
                </button>
            </div>
            <button type="submit" className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Simpan
            </button>
        </form>
    );
};

export default OkupasiAddForm;
