import React, { useEffect, useState } from 'react';
import Select, { components, OptionProps } from 'react-select';
import { getOkupasiByKode, getAllOkupasi } from '../../api/okupasi-api';
import { editKompetensi } from '../../api/sekolah-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface KompetensiEditComponentProps {
    sekolahId: string;
    unitId: string;
    onSuccess: () => void;
}

const KompetensiEditComponent: React.FC<KompetensiEditComponentProps> = ({ sekolahId, unitId, onSuccess }) => {
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
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                toast.error('Error fetching okupasi.', {
                    position: "bottom-right"
                });
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
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                toast.error('Error fetching unit kompetensi.', {
                    position: "bottom-right"
                });
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
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                toast.error('Error fetching initial data.', {
                    position: "bottom-right"
                });
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
            toast.error('Both Okupasi and at least one Unit Kompetensi must be selected.', {
                position: "bottom-right"
            });
            return;
        }

        try {
            await editKompetensi(sekolahId, selectedOkupasi.value, selectedUnits.map((unit: any) => ({ id: unit.value })));
            toast.success('Kompetensi berhasil diupdate.', {
                position: "bottom-right"
            });
            onSuccess();
        } catch (error: any) {
            const serverErrorMessage = error.response?.data?.errors?.[0]?.message || 'Failed to update kompetensi.';
            toast.error(serverErrorMessage, {
                position: "bottom-right"
            });
            console.error('Error updating kompetensi:', error);
        }
    };

    const Option = (props: OptionProps<any>) => (
        <components.Option {...props}>
            <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
            />{' '}
            <label>{props.label}</label>
        </components.Option>
    );

    if (loading) {
        return <p>Loading...</p>; // Display loading state while fetching data
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
                <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Edit Unit Kompetensi</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 dark:text-gray-300">Okupasi:</label>
                    <Select
                        value={selectedOkupasi}
                        onChange={setSelectedOkupasi}
                        options={okupasiOptions}
                        placeholder="Select Okupasi"
                        className="mb-3"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 dark:text-gray-300">Unit Kompetensi:</label>
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
                        classNamePrefix="react-select"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-800"
                >
                    Simpan
                </button>
            </form>
        </div>
    );
};

export default KompetensiEditComponent;
