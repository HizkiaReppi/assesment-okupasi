import React, { useState } from 'react';
import OkupasiAddForm from '../components/okupasi/OkupasiAddForm';
import OkupasiEditForm from '../components/okupasi/OkupasiEditForm';
import OkupasiList from '../components/okupasi/OkupasiList';
import UnitKompetensiAddForm from '../components/okupasi/UnitKompetensiAddForm';
import UnitKompetensiEditForm from '../components/okupasi/UnitKompetensiEditForm';
import UnitKompetensiList from '../components/okupasi/UnitKompetensiList';
import useIsDesktop from '../hooks/useIsDesktop'; 

const DataOkupasiPage: React.FC = () => {
    const [selectedKode, setSelectedKode] = useState<string | null>(null);
    const [editingKode, setEditingKode] = useState<string | null>(null);
    const [editingUnit, setEditingUnit] = useState<{ id: string, nama: string } | null>(null);
    const [refresh, setRefresh] = useState(false);
    const isDesktop = useIsDesktop();

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-4 pt-8">Data Okupasi</h1>
                <div className={`flex ${isDesktop ? 'flex-row' : 'flex-col'} gap-4`}>
                    <div className="flex-1">
                        {!editingKode && !selectedKode && (
                            <OkupasiAddForm onAddSuccess={handleRefresh} />
                        )}
                        {editingKode && (
                            <>
                                <button onClick={() => setEditingKode(null)} className="flex items-center text-red-500 mb-2">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
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
                        {selectedKode && (
                            <>
                                <button onClick={() => setSelectedKode(null)} className="flex items-center text-red-500 mb-2">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                    Back
                                </button>
                                <UnitKompetensiAddForm 
                                    kode={selectedKode} 
                                    onSuccess={() => setSelectedKode(selectedKode)} 
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
                                    onEdit={(id, nama) => setEditingUnit({ id, nama })}
                                />
                                {editingUnit && (
                                    <>
                                        <button onClick={() => setEditingUnit(null)} className="flex items-center text-red-500 mb-2">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                            </svg>
                                            Back
                                        </button>
                                        <UnitKompetensiEditForm 
                                            kode={selectedKode}
                                            unitId={editingUnit.id}
                                            initialNama={editingUnit.nama}
                                            onSuccess={() => setEditingUnit(null)}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataOkupasiPage;
