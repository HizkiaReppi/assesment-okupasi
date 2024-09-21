import React, { useState, useEffect } from 'react';
import Select, { components, OptionProps } from 'react-select';
import { Konsentrasi, konsentrasiApi } from '../../api/konsentrasi-api';
import { updateSekolahKonsentrasi } from '../../api/sekolah-api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SekolahKonsentrasiEditFormProps {
  sekolahId: string;
  currentKonsentrasi: Konsentrasi[];
  onSuccess: () => void;
  onCancel: () => void;
}

const SekolahKonsentrasiEditForm: React.FC<SekolahKonsentrasiEditFormProps> = ({
  sekolahId,
  currentKonsentrasi,
  onSuccess,
  onCancel,
}) => {
  const [allKonsentrasi, setAllKonsentrasi] = useState<Konsentrasi[]>([]);
  const [selectedKonsentrasi, setSelectedKonsentrasi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchKonsentrasi = async () => {
      try {
        const response = await konsentrasiApi.getAll();
        if (response && response.data) {
          setAllKonsentrasi(response.data);
        }
      } catch (error) {
        console.error('Error fetching konsentrasi:', error);
        toast.error('Gagal mengambil data konsentrasi');
      }
    };

    fetchKonsentrasi();
  }, []);

  useEffect(() => {
    setSelectedKonsentrasi(
      currentKonsentrasi.map((k) => ({ value: k.id, label: k.nama })),
    );
  }, [currentKonsentrasi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSekolahKonsentrasi(
        sekolahId,
        selectedKonsentrasi.map((k) => k.value),
      );
      toast.success(
        selectedKonsentrasi.length > 0
          ? 'Konsentrasi sekolah berhasil diperbarui'
          : 'Semua konsentrasi sekolah berhasil dihapus',
      );
      onSuccess();
    } catch (error) {
      console.error('Error updating sekolah konsentrasi:', error);
      toast.error('Gagal memperbarui konsentrasi sekolah');
    } finally {
      setIsLoading(false);
    }
  };

  const Option = (props: OptionProps<any>) => (
    <components.Option {...props}>
      <input
        type='checkbox'
        checked={props.isSelected}
        onChange={() => null}
      />{' '}
      <label>{props.label}</label>
    </components.Option>
  );

  return (
    <div className='bg-white p-6 rounded-lg shadow-md dark:bg-gray-800'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
        Edit Konsentrasi Sekolah
      </h2>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-white mb-1'>
            Konsentrasi:
          </label>
          <Select
            isMulti
            value={selectedKonsentrasi}
            onChange={(newValue) => setSelectedKonsentrasi([...newValue])}
            options={allKonsentrasi.map((k) => ({
              value: k.id,
              label: k.nama,
            }))}
            placeholder='Pilih Konsentrasi'
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option }}
            className='react-select-container dark:text-gray-700'
            classNamePrefix='react-select'
          />
        </div>
        {selectedKonsentrasi.length === 0 && (
          <p className='text-yellow-600 dark:text-yellow-400'>
            Minimal 1 Konsentrasi yang dipilih
          </p>
        )}
        <div className='flex justify-end space-x-2 mt-4'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors'
          >
            Batal
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Memperbarui...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SekolahKonsentrasiEditForm;
