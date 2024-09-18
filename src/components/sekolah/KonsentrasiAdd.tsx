import React, { useState } from 'react';
import { konsentrasiApi } from '../../api/konsentrasi-api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';

interface KonsentrasiAddProps {
    sekolahId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const KonsentrasiAdd: React.FC<KonsentrasiAddProps> = ({
    sekolahId,
    onClose,
    onSuccess
}) => {
    const [konsentrasiInputs, setKonsentrasiInputs] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...konsentrasiInputs];
        newInputs[index] = value;
        setKonsentrasiInputs(newInputs);
    };

    const addInput = () => {
        setKonsentrasiInputs([...konsentrasiInputs, '']);
    };

    const removeInput = (index: number) => {
        const newInputs = konsentrasiInputs.filter((_, i) => i !== index);
        setKonsentrasiInputs(newInputs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const validKonsentrasi = konsentrasiInputs.filter(k => k.trim() !== '');
        
        if (validKonsentrasi.length === 0) {
            toast.error('Mohon masukkan setidaknya satu konsentrasi');
            setLoading(false);
            return;
        }

        try {
            await Promise.all(validKonsentrasi.map(konsentrasi => 
                konsentrasiApi.add({ sekolahId, nama: konsentrasi })
            ));
            toast.success('Konsentrasi berhasil ditambahkan', {
                position: "bottom-right"
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding konsentrasi:', error);
            toast.error('Gagal menambahkan konsentrasi', {
                position: "bottom-right"
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 m" id="konsentrasi-modal">
            <div className="relative top-20 mx-auto p-5 border w-10/12 md:w-96 shadow-lg rounded-md bg-white dark:bg-slate-800">
                <div className="mt-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Tambah Konsentrasi</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-2">
                        {konsentrasiInputs.map((input, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                    placeholder="Masukkan konsentrasi"
                                />
                                {index === konsentrasiInputs.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={addInput}
                                        className="ml-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => removeInput(index)}
                                        className="ml-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="items-center px-4 py-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KonsentrasiAdd;