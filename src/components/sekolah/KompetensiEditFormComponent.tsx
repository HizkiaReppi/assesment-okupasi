import React, { useEffect, useState } from 'react';
import Select, { components, OptionProps } from 'react-select';
import { getOkupasiByKode, getAllOkupasi } from '../../api/okupasi-api';
import { editKompetensi } from '../../api/sekolah-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface KompetensiEditFormProps {
    sekolahId: string;
    unitId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const KompetensiEditForm: React.FC<KompetensiEditFormProps> = ({
    sekolahId,
    unitId,
    onSuccess,
    onCancel
}) => {
    const [okupasiOptions, setOkupasiOptions] = useState<any[]>([]);
    const [selectedOkupasi, setSelectedOkupasi] = useState<any | null>(null);
    const [unitKompetensiOptions, setUnitKompetensiOptions] = useState<any[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllOkupasi = async () => {
            try {
                const data = await getAllOkupasi();
                if (data && data.data) {
                    setOkupasiOptions(data.data.map((item: any) => ({ value: item.kode, label: `${item.kode} - ${item.nama}` })));
                }
            } catch (error) {
                toast.error('Error fetching okupasi.', { position: "bottom-right" });
                console.error('Error fetching okupasi:', error);
            }
        };
        fetchAllOkupasi();
    }, []);

    useEffect(() => {
        const fetchOkupasiByKode = async (kode: string) => {
            try {
                const data = await getOkupasiByKode(kode);
                if (data && data.data && Array.isArray(data.data.unit_kompetensi)) {
                    setUnitKompetensiOptions(data.data.unit_kompetensi.map((unit: any) => ({ value: unit.id, label: unit.nama })));
                }
            } catch (error) {
                toast.error('Error fetching unit kompetensi.', { position: "bottom-right" });
                console.error('Error fetching unit kompetensi:', error);
            }
        };

        if (selectedOkupasi && selectedOkupasi.value) {
            fetchOkupasiByKode(selectedOkupasi.value);
        } else {
            setUnitKompetensiOptions([]);
        }
    }, [selectedOkupasi]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await getOkupasiByKode(unitId);
                if (data && data.data && Array.isArray(data.data.unit_kompetensi)) {
                    const activeUnits = data.data.unit_kompetensi.filter((unit: any) => unit.id === unitId);
                    setSelectedUnits(activeUnits.map((unit: any) => ({ value: unit.id, label: unit.nama })));
                    setUnitKompetensiOptions(activeUnits.map((unit: any) => ({ value: unit.id, label: unit.nama })));
                    setSelectedOkupasi({ value: data.data.kode, label: `${data.data.kode} - ${data.data.nama}` });
                }
            } catch (error) {
                toast.error('Error fetching initial data.', { position: "bottom-right" });
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [unitId]);

    const handleUnitChange = (selectedOptions: any) => {
        setSelectedUnits(selectedOptions);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedOkupasi || selectedUnits.length === 0) {
            toast.error('Both Okupasi and at least one Unit Kompetensi must be selected.', { position: "bottom-right" });
            return;
        }

        try {
            await editKompetensi(sekolahId, selectedOkupasi.value, selectedUnits.map((unit: any) => ({ id: unit.value })));
            toast.success('Kompetensi berhasil diupdate.', { position: "bottom-right" });
            onSuccess();
        } catch (error: any) {
            const serverErrorMessage = error.response?.data?.errors?.[0]?.message || 'Failed to update kompetensi.';
            toast.error(serverErrorMessage, { position: "bottom-right" });
            console.error('Error updating kompetensi:', error);
        }
    };

    const Option = (props: OptionProps<any>) => (
        <components.Option {...props}>
            <input type="checkbox" checked={props.isSelected} onChange={() => null} />{' '}
            <label>{props.label}</label>
        </components.Option>
    );

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Edit Kompetensi</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Okupasi:</label>
                    <Select
                        value={selectedOkupasi}
                        onChange={setSelectedOkupasi}
                        options={okupasiOptions}
                        placeholder="Select Okupasi"
                        className="react-select-container dark:text-gray-700"
                        classNamePrefix="react-select"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Unit Kompetensi:</label>
                    <Select
                        value={selectedUnits}
                        onChange={handleUnitChange}
                        options={unitKompetensiOptions}
                        placeholder="Select Unit Kompetensi"
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option }}
                        className="react-select-container dark:text-gray-700"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default KompetensiEditForm;