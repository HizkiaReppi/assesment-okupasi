import React, { useState } from 'react';
import { updateUnitKompetensi } from '../../api/okupasi-api';

interface UnitKompetensiEditFormProps {
    kode: string;
    unitId: string;
    initialNama: string;
    onSuccess: () => void;
}

const UnitKompetensiEditForm: React.FC<UnitKompetensiEditFormProps> = ({ kode, unitId, initialNama, onSuccess }) => {
    const [nama, setNama] = useState(initialNama);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            console.log('Updating Unit Kompetensi:', { kode, unitId, nama });
            await updateUnitKompetensi(kode, unitId, nama);
            onSuccess();
        } catch (error) {
            console.error('Error updating Unit Kompetensi:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-orange-500 mb-4">Edit Unit Kompetensi</h3>
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

export default UnitKompetensiEditForm;
