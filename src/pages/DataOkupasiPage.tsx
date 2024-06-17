import React, { useState } from 'react';
import OkupasiAddForm from '../components/okupasi/OkupasiAddForm';
import OkupasiEditForm from '../components/okupasi/OkupasiEditForm';
import OkupasiList from '../components/okupasi/OkupasiList';
import UnitKompetensiAddForm from '../components/okupasi/UnitKompetensiAddForm';
import UnitKompetensiEditForm from '../components/okupasi/UnitKompetensiEditForm';
import UnitKompetensiList from '../components/okupasi/UnitKompetensiList';

const DataOkupasiPage: React.FC = () => {
    const [selectedKode, setSelectedKode] = useState<string | null>(null);
    const [editingKode, setEditingKode] = useState<string | null>(null);
    const [editingUnit, setEditingUnit] = useState<{ id: string, nama: string } | null>(null);
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    console.log('Rendering DataOkupasiPage');
    console.log('selectedKode:', selectedKode);
    console.log('editingKode:', editingKode);
    console.log('editingUnit:', editingUnit);

    return (
        <div className="bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-orange-500 text-center mb-4 pt-8">Data Okupasi</h1>
                <OkupasiAddForm onAddSuccess={handleRefresh} />
                {editingKode && (
                    <OkupasiEditForm 
                        kode={editingKode} 
                        onSuccess={() => {
                            setEditingKode(null);
                            handleRefresh();
                        }} 
                    />
                )}
                <OkupasiList 
                    onEdit={setEditingKode}
                    onViewUnits={setSelectedKode}
                    refresh={refresh} 
                />
                {selectedKode && (
                    <>
                        <UnitKompetensiAddForm 
                            kode={selectedKode} 
                            onSuccess={() => setSelectedKode(selectedKode)} 
                        />
                        <UnitKompetensiList 
                            kode={selectedKode}
                            onEdit={(id, nama) => setEditingUnit({ id, nama })}
                        />
                        {editingUnit && (
                            <UnitKompetensiEditForm 
                                kode={selectedKode}
                                unitId={editingUnit.id}
                                initialNama={editingUnit.nama}
                                onSuccess={() => setEditingUnit(null)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DataOkupasiPage;
