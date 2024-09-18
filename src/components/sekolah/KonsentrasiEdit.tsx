import React, { useState } from 'react';
import { konsentrasiApi } from '../../api/konsentrasi-api';
import { toast } from 'react-toastify';

interface KonsentrasiEditProps {
    sekolahId: string;
    currentKonsentrasi: string;
    onClose: () => void;
    onSuccess: () => void;
}

const KonsentrasiEdit: React.FC<KonsentrasiEditProps> = ({
    sekolahId,
    currentKonsentrasi,
    onClose,
    onSuccess
}) => {
    const [konsentrasi, setKonsentrasi] = useState(currentKonsentrasi);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await konsentrasiApi.edit(sekolahId, konsentrasi);
            toast.success('Konsentrasi berhasil diupdate', {
                position: "bottom-right"
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating konsentrasi:', error);
            toast.error('Gagal mengupdate konsentrasi', {
                position: "bottom-right"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Konsentrasi</h3>
                    <form onSubmit={handleSubmit} className="mt-2 px-7 py-3">
                        <input
                            type="text"
                            value={konsentrasi}
                            onChange={(e) => setKonsentrasi(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                            placeholder="Masukkan konsentrasi"
                        />
                        <div className="items-center px-4 py-3">
                            <button
                                id="ok-btn"
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                    <button
                        className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KonsentrasiEdit;