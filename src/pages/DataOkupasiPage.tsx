import React, { useState } from "react";
import OkupasiAddForm from "../components/okupasi/OkupasiAddForm";
import OkupasiEditForm from "../components/okupasi/OkupasiEditForm";
import OkupasiList from "../components/okupasi/OkupasiList";
import UnitKompetensiAddForm from "../components/okupasi/UnitKompetensiAddForm";
import UnitKompetensiEditForm from "../components/okupasi/UnitKompetensiEditForm";
import UnitKompetensiList from "../components/okupasi/UnitKompetensiList";
import ErrorNotification from "../components/ErrorNotification";
import Modal from '../components/EditModal';

const DataOkupasiPage: React.FC = () => {
  const [selectedKode, setSelectedKode] = useState<string | null>(null);
  const [editingKode, setEditingKode] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<{ id: string; nama: string } | null>(null);
  const [addingOkupasi, setAddingOkupasi] = useState<boolean>(false);
  const [addingUnitKompetensi, setAddingUnitKompetensi] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [okupasiName, setOkupasiName] = useState<string>("");

  const handleRefresh = () => {
    setRefresh(prevRefresh => !prevRefresh);
  };

  const handleEditUnit = (unitId: string, initialNama: string) => {
    setEditingUnit({ id: unitId, nama: initialNama });
  };

  const handleEditOkupasi = (kode: string | null) => {
    setSelectedKode(null);
    setEditingKode(kode);
  };

  const handleViewUnits = (kode: string | null, name: string) => {
    setEditingKode(null);
    setSelectedKode(kode);
    setOkupasiName(name);
  };

  const handleAddOkupasi = () => {
    setAddingOkupasi(true);
  };

  const handleAddUnitKompetensi = () => {
    setAddingUnitKompetensi(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 dark:bg-gray-900">
      {errorMessage && <ErrorNotification message={errorMessage} onClose={() => setErrorMessage(null)} />}
      <div className="bg-white p-8 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
        <h1 className="text-2xl font-bold text-center mb-4 pt-8 dark:text-white">Data Okupasi</h1>
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-3xl">
            {!selectedKode && !editingKode && (
              <>
                <button
                  onClick={handleAddOkupasi}
                  className="flex items-center text-black mb-4 bg-slate-300 hover:bg-slate-400 ease-in-out duration-300 p-2 rounded-md dark:text-white dark:bg-slate-700 dark:hover:bg-slate-600"
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
                  Data Okupasi
                </button>
              </>
            )}
            {!selectedKode && (
              <OkupasiList
                onEdit={handleEditOkupasi}
                onViewUnits={handleViewUnits}
                refresh={refresh}
                onRefresh={handleRefresh} // Add onRefresh handler
              />
            )}
            {selectedKode && (
              <>
                <button
                  onClick={() => handleViewUnits(null, "")}
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
                  onClick={handleAddUnitKompetensi}
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
                  Tambah Unit Kompetensi
                </button>
                <UnitKompetensiList
                  kode={selectedKode}
                  okupasiName={okupasiName}
                  onEdit={handleEditUnit}
                  refresh={refresh}
                  editingUnitId={editingUnit?.id || null}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={addingOkupasi}
        onClose={() => setAddingOkupasi(false)}
      >
        <OkupasiAddForm
          onAddSuccess={() => {
            setAddingOkupasi(false);
            handleRefresh();
          }}
        />
      </Modal>

      <Modal
        isOpen={!!editingKode}
        onClose={() => setEditingKode(null)}
      >
        {editingKode && (
          <OkupasiEditForm
            kode={editingKode}
            onSuccess={() => {
              setEditingKode(null);
              handleRefresh();
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={addingUnitKompetensi}
        onClose={() => setAddingUnitKompetensi(false)}
      >
        <UnitKompetensiAddForm
          kode={selectedKode || ''}
          onSuccess={() => {
            setAddingUnitKompetensi(false);
            handleRefresh();
          }}
        />
      </Modal>

      <Modal
        isOpen={!!editingUnit}
        onClose={() => setEditingUnit(null)}
      >
        {editingUnit && (
          <UnitKompetensiEditForm
            kode={selectedKode || ''}
            unitId={editingUnit.id}
            initialNama={editingUnit.nama}
            onSuccess={() => {
              setEditingUnit(null);
              handleRefresh();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default DataOkupasiPage;
