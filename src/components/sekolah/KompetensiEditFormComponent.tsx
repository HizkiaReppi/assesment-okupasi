import React, { useEffect, useState } from 'react';
import Select, { components, OptionProps } from 'react-select';
import { getOkupasiByKode, getAllOkupasi } from '../../api/okupasi-api';
import { editKompetensi, getAllKompetensi } from '../../api/sekolah-api';

interface KompetensiEditFormComponentProps {
    sekolahId: string;
    unitId: string;
    onSuccess: () => void;
    onError: (message: string | string[]) => void;
}

const KompetensiEditFormComponent: React.FC<KompetensiEditFormComponentProps> = ({ sekolahId, unitId, onSuccess, onError }) => {
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
                onError('Error fetching okupasi.');
                console.error('Error fetching okupasi:', error);
            }
        };
        fetchAllOkupasi();
    }, [onError]);

    useEffect(() => {
        const fetchKompetensi = async () => {
            try {
                const data = await getAllKompetensi(sekolahId);
                const existingKompetensi = data.data.find((item: any) =>
                    item.unit_kompetensi.some((unit: any) => unit.id === unitId)
                );

                if (existingKompetensi) {
                    const selectedOkupasiOption = {
                        value: existingKompetensi.kode,
                        label: `${existingKompetensi.kode} - ${existingKompetensi.nama}`
                    };
                    setSelectedOkupasi(selectedOkupasiOption);

                    const kompetensiOptions = existingKompetensi.unit_kompetensi.map((unit: any) => ({
                        value: unit.id,
                        label: unit.nama
                    }));
                    setUnitKompetensiOptions(kompetensiOptions);
                    setSelectedUnits(kompetensiOptions.filter((u: { value: string; label: string }) => u.value === unitId));
                }
            } catch (error) {
                onError('Error fetching kompetensi details.');
                console.error('Error fetching kompetensi details:', error);
            }
        };

        fetchKompetensi();
    }, [sekolahId, unitId, onError]);

    useEffect(() => {
        if (selectedOkupasi) {
            const fetchOkupasiByKode = async () => {
                try {
                    const data = await getOkupasiByKode(selectedOkupasi.value);
                    setUnitKompetensiOptions(data.data.unit_kompetensi.map((unit: any) => ({ value: unit.id, label: unit.nama })));
                } catch (error) {
                    onError('Error fetching unit kompetensi.');
                    console.error('Error fetching unit kompetensi:', error);
                }
            };
            fetchOkupasiByKode();
        } else {
            setUnitKompetensiOptions([]);
        }
    }, [selectedOkupasi, onError]);

    const handleUnitChange = (selectedOptions: any) => {
        setSelectedUnits(selectedOptions);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedOkupasi || selectedUnits.length === 0) {
            onError('Both Okupasi and at least one Unit Kompetensi must be selected');
            console.error('Both Okupasi and at least one Unit Kompetensi must be selected');
            return;
        }

        try {
            console.log('Submitting updated Kompetensi:', {
                sekolahId,
                kode: selectedOkupasi.value,
                unit_kompetensi: selectedUnits.map((unit: any) => ({ id: unit.value }))
            });

            await editKompetensi(sekolahId, selectedOkupasi.value, selectedUnits.map((unit: any) => ({ id: unit.value })));
            onSuccess();
        } catch (error: any) {
            const serverErrorMessage = error.response?.data?.errors?.map((err: any) => err.message) || 'Failed to update kompetensi.';
            onError(serverErrorMessage);
            console.error('Failed to update kompetensi:', error);
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
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Unit Kompetensi</h3>
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
    );
};

export default KompetensiEditFormComponent;
