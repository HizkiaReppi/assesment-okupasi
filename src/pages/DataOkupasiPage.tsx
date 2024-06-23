import React, { useState } from "react";
import OkupasiAddForm from "../components/okupasi/OkupasiAddForm";
import OkupasiEditForm from "../components/okupasi/OkupasiEditForm";
import OkupasiList from "../components/okupasi/OkupasiList";
import UnitKompetensiAddForm from "../components/okupasi/UnitKompetensiAddForm";
import UnitKompetensiEditForm from "../components/okupasi/UnitKompetensiEditForm";
import UnitKompetensiList from "../components/okupasi/UnitKompetensiList";
import useIsDesktop from "../hooks/useIsDesktop"; // untuk handle layout

const DataOkupasiPage: React.FC = () => {
  const [selectedKode, setSelectedKode] = useState<string | null>(null);
  const [editingKode, setEditingKode] = useState<string | null>(null);
  const [editingUnit, setEditingUnit] = useState<{
    id: string;
    nama: string;
  } | null>(null);
  const [refresh, setRefresh] = useState(false);
  const isDesktop = useIsDesktop();
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleSuccess = (updated: boolean) => {
    if (updated) {
      console.log("Unit competency updated. Refreshing list...");
      handleRefresh();
    } else {
      console.log("Failed to update unit competency.");
    }
  };

  const handleRefresh = () => {
    setRefresh(!refresh); 
  };

  const handleEditUnit = (unitId: string, initialNama: string) => {
    if (editingUnit) {
      setWarningMessage("Selesaikan pengeditan terlebih dahulu.");
    } else {
      setEditingUnit({ id: unitId, nama: initialNama });
    }
  };

  const handleClearWarning = () => {
    setWarningMessage(null);
  };

  const handleEditUnitSuccess = (updated: boolean) => {
    handleSuccess(updated);
    setEditingUnit(null);
    handleRefresh();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 pt-8">
          Data Okupasi
        </h1>
        {warningMessage && (
          <div className="bg-yellow-200 text-yellow-700 p-4 mb-4 rounded-lg">
            {warningMessage}
            <button
              onClick={handleClearWarning}
              className="ml-4 text-red-500"
            >
              Close
            </button>
          </div>
        )}
        <div className={`flex ${isDesktop ? "flex-row" : "flex-col"} gap-4`}>
          <div className="flex-1">
            {!editingKode && !selectedKode && (
              <OkupasiAddForm onAddSuccess={handleRefresh} />
            )}
            {editingKode && (
              <>
                <button
                  onClick={() => setEditingKode(null)}
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
                <OkupasiEditForm
                  kode={editingKode}
                  onSuccess={() => {
                    setEditingKode(null);
                    handleRefresh();
                  }}
                />
              </>
            )}
            {selectedKode && !editingUnit && (
              <>
                <button
                  onClick={() => setSelectedKode(null)}
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
                <UnitKompetensiAddForm
                  kode={selectedKode}
                  onSuccess={handleRefresh} 
                />
              </>
            )}
            {selectedKode && editingUnit && (
              <>
                <button
                  onClick={() => setEditingUnit(null)}
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
                <UnitKompetensiEditForm
                  kode={selectedKode}
                  unitId={editingUnit.id}
                  initialNama={editingUnit.nama}
                  onSuccess={handleEditUnitSuccess} 
                />
              </>
            )}
          </div>
          <div className="flex-1">
            {!selectedKode && (
              <OkupasiList
                onEdit={setEditingKode}
                onViewUnits={setSelectedKode}
                refresh={refresh}
              />
            )}
            {selectedKode && (
              <>
                <UnitKompetensiList
                  kode={selectedKode}
                  onEdit={handleEditUnit}
                  refresh={refresh} 
                  editingUnitId={editingUnit?.id} // Pass the editing unit ID to highlight it
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataOkupasiPage;
