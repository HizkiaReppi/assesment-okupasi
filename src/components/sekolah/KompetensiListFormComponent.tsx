import React, { useEffect, useState } from 'react';
import Select, { components, OptionProps } from 'react-select';
import { getAllKompetensi, deleteKompetensiById, deleteKompetensiByKodeOkupasi } from '../../api/sekolah-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface KompetensiListProps {
    sekolahId: string;
    onEdit: (unitId: string, initialKode: string) => void;
    refresh: boolean;
    editingUnitId: string | null;
}

const KompetensiList: React.FC<KompetensiListProps> = ({ sekolahId, onEdit, refresh, editingUnitId }) => {
    const [kompetensi, setKompetensi] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedKodeFilter, setSelectedKodeFilter] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
    const itemsPerPage = 5;

    const fetchData = async (search = '', kodeFilter = '') => {
        setLoading(true);
        try {
            const data = await getAllKompetensi(sekolahId, search, itemsPerPage, currentPage + 1);
            if (data && Array.isArray(data.data)) {
                const filteredData = kodeFilter
                    ? data.data.filter((item: any) => item.kode === kodeFilter)
                    : data.data;
                setKompetensi(filteredData);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching kompetensi:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(searchTerm, selectedKodeFilter?.value || '');
    }, [sekolahId, refresh, currentPage, selectedKodeFilter]);

    const handleDeleteById = async (unitId: string) => {
        if (!unitId) {
            console.error('Invalid unitId:', unitId);
            return;
        }
        console.log('Deleting unit kompetensi with id:', unitId);
        try {
            const response = await deleteKompetensiById(sekolahId, unitId);
            console.log('Delete response:', response);
            fetchData(searchTerm, selectedKodeFilter?.value || '');
        } catch (error) {
            console.error('Error deleting Kompetensi by Id:', error);
        }
    };

    const handleDeleteByKode = async (kode: string) => {
        if (!kode) {
            console.error('Invalid kode:', kode);
            return;
        }
        console.log('Deleting kompetensi with kode:', kode);
        try {
            const response = await deleteKompetensiByKodeOkupasi(sekolahId, kode);
            console.log('Delete response:', response);
            fetchData(searchTerm, selectedKodeFilter?.value || '');
        } catch (error) {
            console.error('Error deleting Kompetensi by Kode:', error);
        }
    };

    const handleSearch = () => {
        setCurrentPage(0); // Reset to first page when search query changes
        fetchData(searchTerm, selectedKodeFilter?.value || '');
        setIsSearchPerformed(true);
    };

    const handleClearFilter = () => {
        setSelectedKodeFilter(null);
        fetchData(searchTerm, '');
    };

    const handleBack = () => {
        setSearchTerm('');
        setSelectedKodeFilter(null);
        fetchData('', '');
        setIsSearchPerformed(false);
    };

    const kodeOptions = [
        { value: '', label: 'Clear Filter' },
        ...kompetensi.map(item => ({ value: item.kode, label: `${item.kode} - ${item.nama}` }))
    ];

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = kompetensi.slice(indexOfFirstItem, indexOfLastItem);

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const pageCount = Math.ceil(kompetensi.length / itemsPerPage);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Kompetensi</h3>
            <div className="mb-4">
                <Select
                    options={kodeOptions}
                    value={selectedKodeFilter}
                    onChange={(selectedOption) => {
                        if (selectedOption.value === '') {
                            handleClearFilter();
                        } else {
                            setSelectedKodeFilter(selectedOption);
                            fetchData(searchTerm, selectedOption.value);
                        }
                    }}
                    placeholder="Filter by Kode Okupasi"
                    className="mb-3"
                    components={{ Option: CustomOption }}
                />
                <div className="flex mb-3">
                    <input
                        type="text"
                        placeholder="Search by Kode or Nama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-l-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                    />
                    <button
                        onClick={handleSearch}
                        className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
                {isSearchPerformed && (
                    <button
                        onClick={handleBack}
                        className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </button>
                )}
            </div>
            {kompetensi.length > 0 ? (
                <ul className="list-none">
                    {currentItems.map((item) => (
                        <li key={item.kode} className={`mb-4 p-4 bg-gray-50 rounded-lg shadow-sm ${editingUnitId === item.kode ? 'border border-yellow-500' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="block text-gray-800 font-semibold">{item.kode}</span>
                                    <span className="block text-gray-600">{item.nama}</span>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleDeleteByKode(item.kode)}
                                        className="text-red-500 hover:text-red-700 mr-2"
                                        title="Delete by Kode"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(item.kode, item.nama)}
                                        className="text-blue-500 hover:text-blue-700"
                                        title="Edit"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </div>
                            </div>
                            {item.unit_kompetensi.map((unit: any) => (
                                <div key={unit.id} className="flex items-center mt-1 ml-8">
                                    <button
                                        onClick={() => handleDeleteById(unit.id)}
                                        className="text-red-500 hover:text-red-700 mr-2"
                                        title="Delete by Id"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <span className="text-gray-600">{unit.nama}</span>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No kompetensi found.</p>
            )}
            <div className="flex justify-center mt-4">
                {Array.from({ length: pageCount }, (_, i) => (
                    <button key={i} onClick={() => changePage(i)} className={`px-3 py-1 mx-1 ${currentPage === i ? 'bg-blue-700 text-white' : 'bg-blue-300'}`}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CustomOption: React.FC<OptionProps<any>> = (props) => (
    <components.Option {...props}>
        <div className="flex items-center">
            <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
                className="mr-2"
            />
            <label>{props.label}</label>
        </div>
    </components.Option>
);

export default KompetensiList;
