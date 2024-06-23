import React, { useEffect, useState } from 'react';
import Select, { components, OptionProps } from 'react-select';
import { getOkupasiByKode, getAllOkupasi } from '../../api/okupasi-api';
import { addKompetensi } from '../../api/sekolah-api';
import ErrorNotification from '../ErrorNotification';

interface KompetensiAddComponentProps {
    sekolahId: string;
    onSuccess: () => void;
}

const KompetensiAddComponent: React.FC<KompetensiAddComponentProps> = ({ sekolahId, onSuccess }) => {
    const [okupasiOptions, setOkupasiOptions] = useState<any[]>([]);
    const [selectedOkupasi, setSelectedOkupasi] = useState<any | null>(null);
    const [unitKompetensiOptions, setUnitKompetensiOptions] = useState<any[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllOkupasi = async () => {
            try {
                const data = await getAllOkupasi();
                setOkupasiOptions(data.data.map((item: any) => ({ value: item.kode, label: `${item.kode} - ${item.nama}` })));
            } catch (error) {
                setErrorMessage('Error fetching okupasi.');
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
                    setErrorMessage('Error fetching unit kompetensi.');
                    console.error('Error fetching unit kompetensi:', error);
                }
            };
            fetchOkupasiByKode();
        } else {
            setUnitKompetensiOptions([]);
        }
    }, [selectedOkupasi]);

    const handleUnitChange = (selectedOptions: any) => {
        setSelectedUnits(selectedOptions);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedOkupasi || selectedUnits.length === 0) {
            setErrorMessage('Both Okupasi and at least one Unit Kompetensi must be selected');
            console.error('Both Okupasi and at least one Unit Kompetensi must be selected');
            return;
        }

        try {
            console.log('Submitting Kompetensi:', {
                sekolahId,
                kode: selectedOkupasi.value,
                unit_kompetensi: selectedUnits.map((unit: any) => ({ id: unit.value }))
            });

            await addKompetensi(sekolahId, selectedOkupasi.value, selectedUnits.map((unit: any) => ({ id: unit.value })));
            onSuccess();
        } catch (error: any) {
            const serverErrorMessage = error.response?.data?.errors?.[0]?.message || 'Failed to add kompetensi.';
            setErrorMessage(serverErrorMessage);
            console.error('Error adding kompetensi:', error);
        }
    };

    const Option = (props: OptionProps<any>) => {
        return (
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{' '}
                <label>{props.label}</label>
            </components.Option>
        );
    };

    return (
        <div>
            {errorMessage && <ErrorNotification message={errorMessage} onClose={() => setErrorMessage(null)} />}
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tambah Unit Kompetensi</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Okupasi:</label>
                    <Select
                        value={selectedOkupasi}
                        onChange={setSelectedOkupasi}
                        options={okupasiOptions}
                        placeholder="Select Okupasi"
                        className="mb-3"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Unit Kompetensi:</label>
                    <Select
                        value={selectedUnits}
                        onChange={handleUnitChange}
                        options={unitKompetensiOptions}
                        placeholder="Select Unit Kompetensi"
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option }}
                        className="mb-3"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 ease-in-out"
                >
                    Simpan
                </button>
            </form>
        </div>
    );
};

export default KompetensiAddComponent;
