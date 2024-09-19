import React, { useState, useEffect } from 'react';
import { addSekolah} from '../../api/sekolah-api';
import { konsentrasiApi } from '../../api/konsentrasi-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SekolahAddFormProps {
    onAddSuccess: () => void;
}

interface Konsentrasi {
    id: string;
    kode: string;
    nama: string;
}

const SekolahAddForm: React.FC<SekolahAddFormProps> = ({ onAddSuccess }) => {
    const [nama, setNama] = useState('');
    const [kota, setKota] = useState('');
    const [jumlahSiswa, setJumlahSiswa] = useState('');
    const [jumlahKelulusan, setJumlahKelulusan] = useState('');
    const [konsentrasiOptions, setKonsentrasiOptions] = useState<Konsentrasi[]>([]);
    const [selectedKonsentrasi, setSelectedKonsentrasi] = useState<Konsentrasi[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch all konsentrasi options for the dropdown
        const fetchKonsentrasi = async () => {
            try {
                const response = await konsentrasiApi.getAll();
                if (response.data) {
                    setKonsentrasiOptions(response.data);
                }
            } catch (error) {
                console.error('Error fetching konsentrasi:', error);
                toast.error('Gagal memuat konsentrasi.', { position: 'bottom-right' });
            }
        };

        fetchKonsentrasi();
    }, []);

    const validateNumber = (value: string) => /^[0-9]*$/.test(value);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (nama.trim() === '') {
            setError('Nama tidak boleh kosong.');
            toast.error('Nama tidak boleh kosong.', { position: 'bottom-right' });
            return;
        }

        if (kota.trim() === '') {
            setError('Kota tidak boleh kosong.');
            toast.error('Kota tidak boleh kosong.', { position: 'bottom-right' });
            return;
        }

        if (!validateNumber(jumlahSiswa)) {
            setError('Jumlah siswa harus berupa angka.');
            toast.error('Jumlah siswa harus berupa angka.', { position: 'bottom-right' });
            return;
        }

        if (!validateNumber(jumlahKelulusan)) {
            setError('Jumlah kelulusan harus berupa angka.');
            toast.error('Jumlah kelulusan harus berupa angka.', { position: 'bottom-right' });
            return;
        }

        try {
            await addSekolah(
                nama,
                kota,
                isNaN(parseInt(jumlahSiswa)) ? 0 : parseInt(jumlahSiswa),
                isNaN(parseInt(jumlahKelulusan)) ? 0 : parseInt(jumlahKelulusan),
                selectedKonsentrasi.map(k => ({ id: k.id })) // Pass selected konsentrasi IDs
            );

            setNama('');
            setKota('');
            setJumlahSiswa('');
            setJumlahKelulusan('');
            setSelectedKonsentrasi([]);
            setError(null);
            onAddSuccess();
            toast.success(`Sekolah ${nama} berhasil ditambahkan.`, { position: 'bottom-right' });
        } catch (error) {
            console.error('Error adding Sekolah:', error);
            setError('Gagal menambahkan sekolah. Silakan coba lagi.');
            toast.error('Gagal menambahkan sekolah. Silakan coba lagi.', { position: 'bottom-right' });
        }
    };

    const handleKonsentrasiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selectedItem = konsentrasiOptions.find(k => k.id === selectedId);
        if (selectedItem && !selectedKonsentrasi.some(k => k.id === selectedItem.id)) {
            setSelectedKonsentrasi([...selectedKonsentrasi, selectedItem]);
        }
    };

    const removeKonsentrasi = (id: string) => {
        setSelectedKonsentrasi(selectedKonsentrasi.filter(k => k.id !== id));
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-lg font-bold text-black mb-4 dark:text-white">Tambah Sekolah</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Nama:</label>
                <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Kota:</label>
                <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    required
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Jumlah Siswa:</label>
                <input
                    type="text"
                    value={jumlahSiswa}
                    onChange={(e) => validateNumber(e.target.value) && setJumlahSiswa(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Jumlah Kelulusan:</label>
                <input
                    type="text"
                    value={jumlahKelulusan}
                    onChange={(e) => validateNumber(e.target.value) && setJumlahKelulusan(e.target.value)}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300">Pilih Konsentrasi:</label>
                <select
                    onChange={handleKonsentrasiChange}
                    className="mt-1 p-3 block w-full rounded-md border-2 border-gray-300 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
                >
                    <option value="">-- Pilih Konsentrasi --</option>
                    {konsentrasiOptions.map((konsentrasi) => (
                        <option key={konsentrasi.id} value={konsentrasi.id}>
                            {konsentrasi.nama}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Konsentrasi yang Dipilih:</h3>
                <ul className="list-disc pl-5">
                    {selectedKonsentrasi.map((konsentrasi) => (
                        <li key={konsentrasi.id} className="flex items-center">
                            {konsentrasi.nama}
                            <button
                                type="button"
                                onClick={() => removeKonsentrasi(konsentrasi.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                type="submit"
                className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
            >
                Simpan
            </button>
        </form>
    );
};

export default SekolahAddForm;
