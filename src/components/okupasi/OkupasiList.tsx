import React, { useEffect, useState } from "react";
import { getAllOkupasi, deleteOkupasi, getOkupasiByKode } from "../../api/okupasi-api";
import ConfirmationModal from "../ConfirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import BackToTopButton from '../BackToTopButton';

interface OkupasiListProps {
  onEdit: (kode: string) => void;
  onViewUnits: (kode: string, name: string) => void;
  refresh: boolean;
  onRefresh: () => void;
}

const OkupasiList: React.FC<OkupasiListProps> = ({
  onEdit,
  onViewUnits,
  refresh,
  onRefresh,
}) => {
  const [okupasi, setOkupasi] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "code">("name");
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteKode, setDeleteKode] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [refresh, searchTerm, currentPage, searchType]);

  const fetchData = async () => {
    try {
      if (searchType === "code" && searchTerm) {
        const data = await getOkupasiByKode(searchTerm);
        if (data && data.status === "success" && data.data) {
          setOkupasi([data.data]); // Wrap dalam array karena getOkupasiByKode mengembalikan objek tunggal
          setTotalItems(1);
        } else {
          setOkupasi([]);
          setTotalItems(0);
        }
      } else {
        const data = await getAllOkupasi(searchTerm, itemsPerPage, currentPage);
        if (data && data.status === "success") {
          setOkupasi(data.data);
          setTotalItems(data.total_result);
        } else {
          console.error("Data is not valid:", data);
          setOkupasi([]);
          setTotalItems(0);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setOkupasi([]);
      setTotalItems(0);
    }
  };

  const handleDelete = async () => {
    if (!deleteKode) return;

    try {
      await deleteOkupasi(deleteKode);
      const deletedItem = okupasi.find((item) => item.kode === deleteKode);
      setOkupasi(okupasi.filter((item) => item.kode !== deleteKode));
      setTotalItems(totalItems - 1);
      toast.error(
        `Item dengan kode ${deletedItem.kode} dan nama ${deletedItem.nama} berhasil dihapus.`,
        {
          position: "bottom-right",
        }
      );
      closeModal();
      onRefresh();
    } catch (error) {
      console.error("Error deleting Okupasi:", error);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchType("name");
    setCurrentPage(1);
    fetchData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as "name" | "code");
    setSearchTerm(''); // Reset searchTerm when changing search type
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageButtons = [];

    if (totalPages <= 1) return null;

    if (currentPage > 1) {
        pageButtons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
        );
    }

    if (currentPage > 2) {
        pageButtons.push(
            <button
                key={1}
                onClick={() => handlePageChange(1)}
                className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
                1
            </button>
        );
    }

    if (currentPage > 3) {
        pageButtons.push(<span key="dots1" className="px-3 py-1 mx-1">...</span>);
    }

    if (currentPage > 1) {
        pageButtons.push(
            <button
                key={currentPage - 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
                {currentPage - 1}
            </button>
        );
    }

    pageButtons.push(
        <button
            key={currentPage}
            className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-500 text-white dark:bg-gray-800"
        >
            {currentPage}
        </button>
    );

    if (currentPage < totalPages) {
        pageButtons.push(
            <button
                key={currentPage + 1}
                onClick={() => handlePageChange(currentPage + 1)}
                className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
                {currentPage + 1}
            </button>
        );
    }

    if (currentPage < totalPages - 2) {
        pageButtons.push(<span key="dots2" className="px-3 py-1 mx-1">...</span>);
    }

    if (currentPage < totalPages - 1) {
        pageButtons.push(
            <button
                key={totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
                {totalPages}
            </button>
        );
    }

    if (currentPage < totalPages) {
        pageButtons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        );
    }

    return pageButtons;
  };

  const openModal = (kode: string) => {
    setDeleteKode(kode);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setDeleteKode(null);
    setIsModalOpen(false);
  };
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md relative dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">Daftar Okupasi</h2>
      <div className="flex mb-4">
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="p-2 border border-gray-300 rounded-l-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        >
          <option value="name">Nama</option>
          <option value="code">Kode</option>
        </select>
        <input
          type="text"
          placeholder={searchType === "name" ? "Cari nama okupasi" : "Cari kode okupasi"}
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Search
        </button>
        <button
          onClick={handleClearSearch}
          className="ml-2 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          Batalkan
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
        Data {itemsPerPage * (currentPage - 1) + 1} - {Math.min(itemsPerPage * currentPage, totalItems)} dari {totalItems}
      </p>
      <ul className="list-none">
        {okupasi.map((item) => (
          <li
            key={item.kode}
            className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-700"
          >
            <span className="block text-gray-900 font-semibold mb-2 dark:text-white">
              {item.nama.toUpperCase()} <br />
              Kode: {item.kode}
            </span>

            <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => onEdit(item.kode)}
                className="relative overflow-hidden text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 before:absolute before:inset-0 before:bg-gray-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => onViewUnits(item.kode, item.nama)}
                className="relative overflow-hidden text-sm bg-blue-300 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-400 before:absolute before:inset-0 before:bg-blue-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
              >
                Cek Kompetensi
              </button>
              <button
                onClick={() => openModal(item.kode)}
                className="relative overflow-hidden text-sm bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 before:absolute before:inset-0 before:bg-red-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {okupasi.length === 0 && (
          <li className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-700">
            <span className="block text-gray-900 font-semibold mb-2 dark:text-white">
              Tidak ada hasil yang ditemukan.
            </span>
          </li>
        )}
      </ul>
      <div className="mt-4 flex justify-center">
        {renderPagination()}
      </div>
      <BackToTopButton />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        message="Yakin untuk menghapus item ini?"
      />
    </div>
  );
};

export default OkupasiList;