import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import KonsentrasiEdit from './KonsentrasiEdit';

interface KonsentrasiListProps {
    sekolahId: string;
    konsentrasi: string[];
    onRefresh: () => void;
}

const KonsentrasiList: React.FC<KonsentrasiListProps> = ({ sekolahId, konsentrasi, onRefresh }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingKonsentrasi, setEditingKonsentrasi] = useState('');

    const handleEditClick = (konsentrasiItem: string) => {
        setEditingKonsentrasi(konsentrasiItem);
        setShowEditModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        onRefresh();
    };

    return (
        <div className="my-2">
            <span className="font-semibold">Konsentrasi:</span>
            <ul className="list-disc list-inside">
                {konsentrasi.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                        <span>{item}</span>
                        <button
                            onClick={() => handleEditClick(item)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            title="Edit Konsentrasi"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    </li>
                ))}
            </ul>
            {showEditModal && (
                <KonsentrasiEdit
                    sekolahId={sekolahId}
                    currentKonsentrasi={editingKonsentrasi}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default KonsentrasiList;