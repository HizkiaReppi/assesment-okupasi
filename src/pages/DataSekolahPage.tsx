import { useState} from "react";
import SekolahAddForm from "../components/sekolah/SekolahAddFormComponent";
import SekolahEditForm from "../components/sekolah/SekolahEditFormComponent";
import SekolahList from "../components/sekolah/SekolahListComponent";
import KompetensiAddForm from "../components/sekolah/KompetensiAddComponent";
import KompetensiEditForm from "../components/sekolah/KompetensiEditFormComponent";
import KompetensiList from "../components/sekolah/KompetensiListFormComponent";
import useIsDesktop from "../hooks/useIsDesktop"; // untuk handle layout
import ErrorNotification from "../components/ErrorNotification";

const DataSekolahPage: React.FC = () => {
    const [selectedSekolahId, setSelectedSekolahId] = useState<string | null>(null);
    const [editingSekolahId, setEditingSekolahId] = useState<string | null>(null);
    const [editingKompetensi, setEditingKompetensi] = useState<{
        id: string;
        kode: string;
    } | null>(null);
    const [selectedSchool, setSelectedSchool] = useState<{ id: string | null, nama: string, kota: string }>({ id: null, nama: '', kota: '' });
    const [refresh, setRefresh] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const isDesktop = useIsDesktop();

    const handleSuccess = () => {
        console.log("Kompetensi updated successfully.");
        handleRefresh();
    };

    const handleRefresh = () => {
        setRefresh(prevRefresh => !prevRefresh);
    };

    const handleEditKompetensi = (unitId: string, initialKode: string) => {
        setEditingKompetensi({ id: unitId, kode: initialKode });
    };

    // @ts-ignore
    // handle error not used
    const handleError = (message: string | string[]) => {
        const errorMessage = Array.isArray(message) ? message.join(", ") : message;
        setErrorMessage(errorMessage);
    };

    const handleEditSekolah = (id: string, nama: string, kota: string) => {
        setSelectedSchool({ id, nama, kota });
        setEditingSekolahId(id);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {errorMessage && <ErrorNotification message={errorMessage} onClose={() => setErrorMessage(null)} />}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4 pt-8">Data Sekolah</h1>
                <div className={`flex ${isDesktop ? "flex-row" : "flex-col"} gap-4`}>
                    <div className="flex-1">
                        {!editingSekolahId && !selectedSekolahId && (
                            <SekolahAddForm onAddSuccess={handleRefresh} />
                        )}
                        {editingSekolahId && (
                            <>
                                <button
                                    onClick={() => setEditingSekolahId(null)}
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
                                <SekolahEditForm
                                    id={selectedSchool.id || ''}
                                    initialNama={selectedSchool.nama}
                                    initialKota={selectedSchool.kota}
                                    onSuccess={() => {
                                        setEditingSekolahId(null);
                                        handleRefresh();
                                    }}
                                    // onError={handleError}
                                />
                            </>
                        )}
                        {selectedSekolahId && !editingKompetensi && (
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
                                <KompetensiAddForm
                                    sekolahId={selectedSekolahId}
                                    onSuccess={handleSuccess}
                                />
                            </>
                        )}
                        {selectedSekolahId && editingKompetensi && (
                            <>
                                <button
                                    onClick={() => setEditingKompetensi(null)}
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
                                    Batal Edit
                                </button>
                                <KompetensiEditForm
                                    sekolahId={selectedSekolahId}
                                    unitId={editingKompetensi.id}
                                    onSuccess={() => {
                                        setEditingKompetensi(null);
                                        handleSuccess();
                                    }}
                                />
                            </>
                        )}
                    </div>
                    <div className="flex-1">
                        {!selectedSekolahId && (
                            <SekolahList
                                onEdit={handleEditSekolah}
                                onViewKompetensi={setSelectedSekolahId}
                                refresh={refresh}
                                editingId={editingSekolahId}
                            />
                        )}
                        {selectedSekolahId && (
                            <>
                                <KompetensiList
                                    sekolahId={selectedSekolahId}
                                    onEdit={handleEditKompetensi}
                                    refresh={refresh}
                                    editingUnitId={editingKompetensi?.id || null}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSekolahPage;

