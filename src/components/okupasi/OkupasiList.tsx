/*
List of constants:
- okupasiList: OkupasiItem[]
- currentPage: number
- searchTerm: string
- searchType: "name" | "code"
- totalItems: number
- isModalOpen: boolean
- deleteKode: string | null
- isDesktop: boolean
- itemsPerPage: number

List of functions:
- fetchOkupasiData()
- handleSingleOkupasiResult(data: any)
- handleMultipleOkupasiResult(data: any)
- resetOkupasiList()
- handleDelete()
- updateOkupasiListAfterDelete(deletedKode: string)
- showDeleteSuccessToast(deletedItem: OkupasiItem | undefined)
- handleClearSearch()
- handleSearchChange(e: React.ChangeEvent<HTMLInputElement>)
- handleSearch()
- handleSearchTypeChange(e: React.ChangeEvent<HTMLSelectElement>)
- handlePageChange(pageNumber: number)
- renderPaginationButton(pageNumber: number, label: string | React.ReactNode)
- renderPagination()
- openModal(kode: string)
- closeModal()
- renderSearchBar()
- renderOkupasiItem(item: OkupasiItem)
*/

import React, { useEffect, useState } from "react";
import {
  getAllOkupasi,
  deleteOkupasi,
  getOkupasiByKode,
} from "../../api/okupasi-api";
import ConfirmationModal from "../ConfirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import BackToTopButton from "../BackToTopButton";
import useIsDesktop from "../../hooks/useIsDesktop";

interface OkupasiListProps {
  onEdit: (kode: string) => void;
  onViewUnits: (kode: string, name: string) => void;
  refresh: boolean;
  onRefresh: () => void;
}

interface OkupasiItem {
  kode: string;
  nama: string;
}

const OkupasiList: React.FC<OkupasiListProps> = ({
  onEdit,
  onViewUnits,
  refresh,
  onRefresh,
}) => {
  const [okupasiList, setOkupasiList] = useState<OkupasiItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "code">("name");
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteKode, setDeleteKode] = useState<string | null>(null);
  const isDesktop = useIsDesktop();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOkupasiData();
  }, [refresh, searchTerm, currentPage, searchType]);

  const fetchOkupasiData = async () => {
    try {
      if (searchType === "code" && searchTerm) {
        const data = await getOkupasiByKode(searchTerm);
        handleSingleOkupasiResult(data);
      } else {
        const data = await getAllOkupasi(searchTerm, itemsPerPage, currentPage);
        handleMultipleOkupasiResult(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      resetOkupasiList();
    }
  };

  const handleSingleOkupasiResult = (data: any) => {
    if (data && data.status === "success" && data.data) {
      setOkupasiList([data.data]);
      setTotalItems(1);
    } else {
      resetOkupasiList();
    }
  };

  const handleMultipleOkupasiResult = (data: any) => {
    if (data && data.status === "success") {
      setOkupasiList(data.data);
      setTotalItems(data.total_result);
    } else {
      console.error("Data is not valid:", data);
      resetOkupasiList();
    }
  };

  const resetOkupasiList = () => {
    setOkupasiList([]);
    setTotalItems(0);
  };

  const handleDelete = async () => {
    if (!deleteKode) return;

    try {
      await deleteOkupasi(deleteKode);
      const deletedItem = okupasiList.find((item) => item.kode === deleteKode);
      updateOkupasiListAfterDelete(deleteKode);
      showDeleteSuccessToast(deletedItem);
      closeModal();
      onRefresh();
    } catch (error) {
      console.error("Error deleting Okupasi:", error);
    }
  };

  const updateOkupasiListAfterDelete = (deletedKode: string) => {
    setOkupasiList(okupasiList.filter((item) => item.kode !== deletedKode));
    setTotalItems(totalItems - 1);
  };

  const showDeleteSuccessToast = (deletedItem: OkupasiItem | undefined) => {
    if (deletedItem) {
      toast.error(
        `Item dengan kode ${deletedItem.kode} dan nama ${deletedItem.nama} berhasil dihapus.`,
        { position: "bottom-right" }
      );
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchType("name");
    setCurrentPage(1);
    fetchOkupasiData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOkupasiData();
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as "name" | "code");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButton = (pageNumber: number, label: string | React.ReactNode) => (
    <button
      key={pageNumber}
      onClick={() => handlePageChange(pageNumber)}
      className="relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
    >
      {label}
    </button>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const pageButtons = [];

    if (currentPage > 1) {
      pageButtons.push(renderPaginationButton(currentPage - 1, <FontAwesomeIcon icon={faArrowLeft} />));
    }

    if (currentPage > 2) {
      pageButtons.push(renderPaginationButton(1, "1"));
    }

    if (currentPage > 3) {
      pageButtons.push(<span key="dots1" className="px-3 py-1 mx-1">...</span>);
    }

    if (currentPage > 1) {
      pageButtons.push(renderPaginationButton(currentPage - 1, currentPage - 1));
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
      pageButtons.push(renderPaginationButton(currentPage + 1, currentPage + 1));
    }

    if (currentPage < totalPages - 2) {
      pageButtons.push(<span key="dots2" className="px-3 py-1 mx-1">...</span>);
    }

    if (currentPage < totalPages - 1) {
      pageButtons.push(renderPaginationButton(totalPages, totalPages));
    }

    if (currentPage < totalPages) {
      pageButtons.push(renderPaginationButton(currentPage + 1, <FontAwesomeIcon icon={faArrowRight} />));
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

  const renderSearchBar = () => (
    <div className={`flex flex-col mb-4 ${isDesktop ? "sm:flex-row" : ""}`}>
      <div className={`flex ${isDesktop ? "w-full" : "mb-2"}`}>
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
          placeholder={
            searchType === "name" ? "Cari nama okupasi" : "Cari kode okupasi"
          }
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 w-full dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        />
      </div>
      <div className={`flex ${isDesktop ? "ml-2" : "mt-2"}`}>
        <button
          onClick={handleSearch}
          className={`flex-1 bg-blue-500 text-white p-2 ${
            isDesktop ? "rounded-l-md" : "rounded-md mr-1"
          } hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600`}
        >
          Search
        </button>
        <button
          onClick={handleClearSearch}
          className={`flex-1 bg-gray-500 text-white p-2 ${
            isDesktop ? "rounded-r-md" : "rounded-md ml-1"
          } hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500`}
        >
          Batalkan
        </button>
      </div>
    </div>
  );

  const renderOkupasiItem = (item: OkupasiItem) => (
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
  );

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md relative dark:bg-gray-800 dark:text-white">
      {renderSearchBar()}
      <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
        Data {itemsPerPage * (currentPage - 1) + 1} -{" "}
        {Math.min(itemsPerPage * currentPage, totalItems)} dari {totalItems}
      </p>
      <ul className="list-none">
        {okupasiList.map(renderOkupasiItem)}
        {okupasiList.length === 0 && (
          <li className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-700">
            <span className="block text-gray-900 font-semibold mb-2 dark:text-white">
              Tidak ada hasil yang ditemukan.
            </span>
          </li>
        )}
      </ul>
      <div className="mt-4 flex justify-center">{renderPagination()}</div>
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