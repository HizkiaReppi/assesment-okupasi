import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getOkupasiByKode, getAllOkupasi } from '../../api/okupasi-api';
import { addKompetensi } from '../../api/sekolah-api';

interface KompetensiAddComponentProps {
    sekolahId: string;
    onSuccess: () => void;
}

const KompetensiAddComponent: React.FC<KompetensiAddComponentProps> = ({ sekolahId, onSuccess }) => {
    const [okupasiOptions, setOkupasiOptions] = useState<any[]>([]);
    const [selectedOkupasi, setSelectedOkupasi] = useState<any | null>(null);
    const [unitKompetensiOptions, setUnitKompetensiOptions] = useState<any[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<any[]>([]);

    useEffect(() => {
        const fetchAllOkupasi = async () => {
            try {
                const data = await getAllOkupasi();
                setOkupasiOptions(data.data.map((item: any) => ({ value: item.kode, label: `${item.kode} - ${item.nama}` })));
            } catch (error) {
                console.error('Error fetching okupasi:', error);
            }
        };
        fetchAllOkupasi();
    }, []);

    useEffect(() => {
        if (selectedOkupasi) {
            const fetchOkupasiByKode = async () => {
                try {
                    const data = await getOkupasiByKode(selectedOkupasi.value);
                    setUnitKompetensiOptions(data.data.unit_kompetensi.map((unit: any) => ({ value: unit.id, label: unit.nama })));
                } catch (error) {
                    console.error('Error fetching unit kompetensi:', error);
                }
            };
            fetchOkupasiByKode();
        } else {
            setUnitKompetensiOptions([]);
        }
    }, [selectedOkupasi]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedOkupasi || selectedUnits.length === 0) {
            console.error('Okupasi and at least one Unit Kompetensi must be selected');
            return;
        }
        try {
            await addKompetensi(sekolahId, selectedOkupasi.value, selectedUnits.map((unit) => ({ id: unit.value })));
            setSelectedOkupasi(null);
            setSelectedUnits([]);
            onSuccess();
        } catch (error) {
            console.error('Error adding kompetensi:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tambah Kompetensi</h3>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Pilih Okupasi:</label>
                <Select
                    value={selectedOkupasi}
                    onChange={setSelectedOkupasi}
                    options={okupasiOptions}
                    placeholder="Cari Okupasi..."
                    className="mb-3"
                />
            </div>
            {selectedOkupasi && (
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Pilih Unit Kompetensi:</label>
                    <Select
                        value={selectedUnits}
                        onChange={(selectedOptions) => setSelectedUnits([...selectedOptions])}
                        options={unitKompetensiOptions}
                        placeholder="Cari Unit Kompetensi..."
                        isMulti
                        className="mb-3"
                    />
                </div>
            )}
            <button
                type="submit"
                className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 ease-in-out"
            >
                Simpan
            </button>
        </form>
    );
};

export default KompetensiAddComponent;
