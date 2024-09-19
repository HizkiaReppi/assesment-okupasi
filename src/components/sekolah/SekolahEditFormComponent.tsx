import React, { useState, useEffect } from "react";
import { editSekolahById } from "../../api/sekolah-api"; 
import { konsentrasiApi, Konsentrasi } from "../../api/konsentrasi-api";
import { updateSekolahKonsentrasi } from "../../api/sekolah-api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SekolahEditFormProps {
  id: string;
  initialNama: string;
  initialKota: string;
  initialJumlahSiswa?: number;
  initialJumlahKelulusan?: number;
  initialKonsentrasi?: Konsentrasi[];
  onSuccess: () => void;
  onError: (message: string | string[]) => void;
}

const SekolahEditForm: React.FC<SekolahEditFormProps> = ({
  id,
  initialNama,
  initialKota,
  initialJumlahSiswa = 0,
  initialJumlahKelulusan = 0,
  initialKonsentrasi = [],
  onSuccess,
  onError,
}) => {
  const [nama, setNama] = useState<string>(initialNama || "");
  const [kota, setKota] = useState<string>(initialKota || "");
  const [jumlahSiswa, setJumlahSiswa] = useState<string>(
    initialJumlahSiswa.toString()
  );
  const [jumlahKelulusan, setJumlahKelulusan] = useState<string>(
    initialJumlahKelulusan.toString()
  );
  const [konsentrasiOptions, setKonsentrasiOptions] = useState<Konsentrasi[]>(
    []
  );
  const [selectedKonsentrasi, setSelectedKonsentrasi] =
    useState<Konsentrasi[]>(initialKonsentrasi);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    const fetchKonsentrasi = async () => {
      try {
        const response = await konsentrasiApi.getAll();
        if (response.data) {
          setKonsentrasiOptions(response.data);
        }
      } catch (error) {
        console.error("Error fetching konsentrasi:", error);
        toast.error("Gagal memuat konsentrasi.", { position: "bottom-right" });
      }
    };

    fetchKonsentrasi();
  }, []);

  const validateNumber = (value: string) => /^[0-9]*$/.test(value);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (nama.trim() === "" || kota.trim() === "") {
      toast.error("Nama Sekolah dan Kota tidak boleh kosong.", {
        position: "bottom-right",
      });
      return;
    }

    if (!validateNumber(jumlahSiswa) || !validateNumber(jumlahKelulusan)) {
      toast.error("Jumlah Siswa dan Kelulusan harus berupa angka.", {
        position: "bottom-right",
      });
      return;
    }

    setLoading(true);
    try {
      await editSekolahById(
        id,
        nama,
        kota,
        parseInt(jumlahSiswa, 10),
        parseInt(jumlahKelulusan, 10)
      );

      await updateSekolahKonsentrasi(
        id,
        selectedKonsentrasi.map((k) => k.id)
      );

      toast.success(`Sekolah ${nama} berhasil diupdate.`, {
        position: "bottom-right",
      });
      onSuccess();
      setIsEdited(false);
    } catch (error) {
      onError("Gagal mengupdate data sekolah. Silakan coba lagi.");
      toast.error("Gagal mengupdate data sekolah.", {
        position: "bottom-right",
      });
      console.error("Error updating Sekolah:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKonsentrasiChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value;
    const selectedItem = konsentrasiOptions.find((k) => k.id === selectedId);
    if (
      selectedItem &&
      !selectedKonsentrasi.some((k) => k.id === selectedItem.id)
    ) {
      setSelectedKonsentrasi([...selectedKonsentrasi, selectedItem]);
      setIsEdited(true);
    }
  };

  const removeKonsentrasi = (id: string) => {
    setSelectedKonsentrasi(selectedKonsentrasi.filter((k) => k.id !== id));
    setIsEdited(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
        Edit Sekolah
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 dark:text-gray-300">
          Nama:
        </label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className={`w-full p-3 border ${
            isEdited ? "border-blue-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 dark:text-gray-300">
          Kota:
        </label>
        <input
          type="text"
          value={kota}
          onChange={(e) => setKota(e.target.value)}
          className={`w-full p-3 border ${
            isEdited ? "border-blue-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 dark:text-gray-300">
          Jumlah Siswa:
        </label>
        <input
          type="text"
          value={jumlahSiswa}
          onChange={(e) =>
            validateNumber(e.target.value) && setJumlahSiswa(e.target.value)
          }
          className={`w-full p-3 border ${
            isEdited ? "border-blue-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 dark:text-gray-300">
          Jumlah Kelulusan:
        </label>
        <input
          type="text"
          value={jumlahKelulusan}
          onChange={(e) =>
            validateNumber(e.target.value) && setJumlahKelulusan(e.target.value)
          }
          className={`w-full p-3 border ${
            isEdited ? "border-blue-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white`}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 dark:text-gray-300">
          Konsentrasi:
        </label>
        <select
          onChange={handleKonsentrasiChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-white"
        >
          <option value="">-- Pilih Konsentrasi --</option>
          {konsentrasiOptions.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nama}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Konsentrasi yang Dipilih:
        </h3>
        <ul className="list-disc pl-5">
          {selectedKonsentrasi.map((k) => (
            <li key={k.id} className="flex items-center">
              {k.nama}
              <button
                type="button"
                onClick={() => removeKonsentrasi(k.id)}
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
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-300"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
};

export default SekolahEditForm;
