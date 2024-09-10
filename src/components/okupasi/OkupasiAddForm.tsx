import React, { useState } from 'react';
import { addOkupasi } from '../../api/okupasi-api';
import { toast } from 'react-toastify';

interface OkupasiAddFormProps {
  onAddSuccess: () => void;
}

interface UnitKompetensi {
  kode_unit: string;
  nama: string;
  standard_kompetensi: string;
}

const OkupasiAddForm: React.FC<OkupasiAddFormProps> = ({ onAddSuccess }) => {
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [unitKompetensi, setUnitKompetensi] = useState<UnitKompetensi[]>([{ kode_unit: '', nama: '', standard_kompetensi: '' }]);
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
      setUnitKompetensi([{ kode_unit: '', nama: '', standard_kompetensi: '' }]);
      setError(null);
      onAddSuccess();
      toast.success(`Okupasi dengan kode ${kode} dan nama ${nama} berhasil ditambahkan.`, {
        position: "bottom-right"
      });
    } catch (error) {
      toast.error('Gagal menambahkan okupasi. Silakan coba lagi.', {
        position: "bottom-right"
      });
    }
  };

  const handleUnitKompetensiChange = (index: number, field: keyof UnitKompetensi, value: string) => {
    const updatedUnits = unitKompetensi.map((unit, i) =>
      i === index ? { ...unit, [field]: value } : unit
    );
    setUnitKompetensi(updatedUnits);
  };

  const addUnitKompetensiField = () => {
    setUnitKompetensi([...unitKompetensi, { kode_unit: '', nama: '', standard_kompetensi: '' }]);
  };

  const removeUnitKompetensiField = (index: number) => {
    setUnitKompetensi(unitKompetensi.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Okupasi</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kode">
            Kode
          </label>
          <input
            id="kode"
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Masukkan kode okupasi"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
            Nama
          </label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Masukkan nama okupasi"
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Unit Kompetensi</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {unitKompetensi.map((unit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => removeUnitKompetensiField(index)}
                >
                  &#x2715;
                </button>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={unit.kode_unit}
                    onChange={(e) => handleUnitKompetensiChange(index, 'kode_unit', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Kode Unit"
                  />
                  <input
                    type="text"
                    value={unit.nama}
                    onChange={(e) => handleUnitKompetensiChange(index, 'nama', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Nama Unit"
                  />
                  <input
                    type="text"
                    value={unit.standard_kompetensi}
                    onChange={(e) => handleUnitKompetensiChange(index, 'standard_kompetensi', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Standard Kompetensi"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={addUnitKompetensiField}
          >
            <span className="mr-2">+</span>
            Tambah Unit Kompetensi
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Simpan Okupasi
          </button>
        </div>
      </form>
    </div>
  );
};

export default OkupasiAddForm;