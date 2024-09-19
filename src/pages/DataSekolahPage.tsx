import { useState } from "react";
import SekolahEditForm from "../components/sekolah/SekolahEditFormComponent";
import SekolahList from "../components/sekolah/SekolahListComponent";
import KompetensiAddForm from "../components/sekolah/KompetensiAddComponent";
import KompetensiEditForm from "../components/sekolah/KompetensiEditFormComponent";
import KompetensiList from "../components/sekolah/KompetensiListFormComponent";
import SekolahAddForm from "../components/sekolah/SekolahAddFormComponent";
import ErrorNotification from "../components/ErrorNotification";
import Modal from "../components/EditModal";

const DataSekolahPage: React.FC = () => {
  const [selectedSekolahId, setSelectedSekolahId] = useState<string | null>(
    null
  );
  const [selectedSekolahName, setSelectedSekolahName] = useState<string>("");
  const [editingSekolahId, setEditingSekolahId] = useState<string | null>(null);
  const [addingSekolah, setAddingSekolah] = useState<boolean>(false);
  const [addingKompetensi, setAddingKompetensi] = useState<boolean>(false);
  const [editingKompetensi, setEditingKompetensi] = useState<{
    id: string;
    kode: string;
  } | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<{
    id: string | null;
    nama: string;
    kota: string;
    jumlah_siswa: number;
    jumlah_kelulusan: number;
  }>({ id: null, nama: "", kota: "", jumlah_siswa: 0, jumlah_kelulusan: 0 });
  const [refresh, setRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    handleRefresh();
  };

  const handleRefresh = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const handleEditKompetensi = (unitId: string, initialKode: string) => {
    setEditingKompetensi({ id: unitId, kode: initialKode });
  };

  const handleError = (message: string | string[]) => {
    const errorMessage = Array.isArray(message) ? message.join(", ") : message;
    setErrorMessage(errorMessage);
  };

  const handleEditSekolah = (
    id: string,
    nama: string,
    kota: string,
    jumlah_siswa: number,
    jumlah_kelulusan: number
  ) => {
    setSelectedSchool({ id, nama, kota, jumlah_siswa, jumlah_kelulusan });
    setEditingSekolahId(id);
  };

  const handleAddSekolah = () => {
    setAddingSekolah(true);
  };

  const handleAddKompetensi = () => {
    setAddingKompetensi(true);
  };

  const handleViewKompetensi = (id: string, nama: string) => {
    setSelectedSekolahId(id);
    setSelectedSekolahName(nama);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 dark:bg-gray-900 dark:text-gray-200">
      {errorMessage && (
        <ErrorNotification
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-bold text-center mb-4 pt-8 dark:text-white">
          Data Sekolah
        </h1>
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-3xl">
            {!selectedSekolahId && (
              <>
                <button
                  onClick={handleAddSekolah}
                  className="flex items-center text-black mb-4 bg-slate-300 hover:bg-slate-400 ease-in-out duration-300 p-2 rounded-md dark:text-gray-200 dark:bg-slate-600 dark:hover:bg-slate-700"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Data Sekolah
                </button>
                <SekolahList
                  onEdit={handleEditSekolah}
                  onViewKompetensi={handleViewKompetensi}
                  refresh={refresh}
                  editingId={editingSekolahId}
                  onRefresh={handleRefresh}
                />
              </>
            )}
            {selectedSekolahId && (
              <>
                <button
                  onClick={() => setSelectedSekolahId(null)}
                  className="flex items-center text-red-500 mb-2"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleAddKompetensi}
                  className="flex items-center text-blue-500 mb-4"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Tambah Kompetensi
                </button>
                <KompetensiList
                  sekolahId={selectedSekolahId}
                  schoolName={selectedSekolahName}
                  okupasiName="Nama Okupasi"
                  onEdit={handleEditKompetensi}
                  refresh={refresh}
                  editingUnitId={editingKompetensi?.id || null}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!editingSekolahId}
        onClose={() => setEditingSekolahId(null)}
      >
        <SekolahEditForm
          id={selectedSchool.id || ""}
          initialNama={selectedSchool.nama}
          initialKota={selectedSchool.kota}
          initialJumlahSiswa={selectedSchool.jumlah_siswa}
          initialJumlahKelulusan={selectedSchool.jumlah_kelulusan}
          onSuccess={() => {
            setEditingSekolahId(null);
            handleSuccess();
          }}
          onError={handleError}
        />
      </Modal>

      <Modal isOpen={addingSekolah} onClose={() => setAddingSekolah(false)}>
        <SekolahAddForm
          onAddSuccess={() => {
            setAddingSekolah(false);
            handleSuccess();
          }}
        />
      </Modal>

      <Modal
        isOpen={addingKompetensi}
        onClose={() => setAddingKompetensi(false)}
      >
        <KompetensiAddForm
          onSuccess={() => {
            setAddingKompetensi(false);
            handleSuccess();
          }}
          sekolahId={""}
        />
      </Modal>

      <Modal
        isOpen={!!editingKompetensi}
        onClose={() => setEditingKompetensi(null)}
      >
        <KompetensiEditForm
          sekolahId={selectedSekolahId || ""}
          unitId={editingKompetensi?.id || ""}
          onSuccess={() => {
            setEditingKompetensi(null);
            handleSuccess();
          }}
          onCancel={() => setEditingKompetensi(null)}
        />
      </Modal>
    </div>
  );
};

export default DataSekolahPage;
