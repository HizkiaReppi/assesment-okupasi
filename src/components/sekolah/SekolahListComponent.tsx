import React, { useEffect, useState } from "react";
import { getAllSekolah, deleteSekolahById } from "../../api/sekolah-api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../ConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import BackToTopButton from "../BackToTopButton";
import Pagination from "../pagination";
import SekolahKonsentrasiEditForm from "./SekolahKonsentrasiEditForm";
import EditModal from "../EditModal";

export interface Konsentrasi {
  id: string;
  kode: string;
  nama: string;
}

interface Sekolah {
  id: string;
  nama: string;
  kota: string;
  jumlah_siswa: number;
  jumlah_kelulusan: number;
  konsentrasi: Konsentrasi[];
}

interface SekolahListProps {
  onEdit: (
    id: string,
    nama: string,
    kota: string,
    jumlah_siswa: number,
    jumlah_kelulusan: number
  ) => void;
  onViewKompetensi: (id: string, nama: string) => void;
  refresh: boolean;
  editingId: string | null;
  onRefresh: () => void;
}

const SekolahList: React.FC<SekolahListProps> = ({
  onEdit,
  onViewKompetensi,
  refresh,
  editingId,
  onRefresh,
}) => {
  const [sekolah, setSekolah] = useState<Sekolah[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isKonsentrasiModalOpen, setIsKonsentrasiModalOpen] = useState(false);
  const [selectedSekolahId, setSelectedSekolahId] = useState<string | null>(
    null
  );
  const [selectedSekolahKonsentrasi, setSelectedSekolahKonsentrasi] = useState<
    Konsentrasi[]
  >([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSekolah(
          searchQuery,
          itemsPerPage,
          currentPage
        );
        if (data && Array.isArray(data.data)) {
          setSekolah(data.data);
          setTotalItems(data.total_result);
        }
      } catch (error) {
        console.error("Error fetching Sekolah:", error);
      }
    };

    fetchData();
  }, [refresh, currentPage, searchQuery]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteSekolahById(deleteId);
      const deletedItem = sekolah.find((item) => item.id === deleteId);
      setSekolah(sekolah.filter((item) => item.id !== deleteId));
      setTotalItems(totalItems - 1);
      toast.error(
        `Sekolah dengan nama ${deletedItem?.nama} berhasil dihapus.`,
        {
          position: "bottom-right",
        }
      );
      closeModal();
      onRefresh();
    } catch (error) {
      console.error("Error deleting Sekolah:", error);
    }
  };

  const openModal = (id: string) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDeleteId(null);
    setIsModalOpen(false);
  };

  const handleEditKonsentrasi = (sekolah: Sekolah) => {
    setSelectedSekolahId(sekolah.id);
    setSelectedSekolahKonsentrasi(sekolah.konsentrasi);
    setIsKonsentrasiModalOpen(true);
  };

  const handleKonsentrasiEditSuccess = () => {
    setIsKonsentrasiModalOpen(false);
    onRefresh();
  };

  const handleKonsentrasiEditCancel = () => {
    setIsKonsentrasiModalOpen(false);
    setSelectedSekolahId(null);
    setSelectedSekolahKonsentrasi([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md relative dark:bg-gray-800 dark:text-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-white">
        Daftar Sekolah
      </h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Cari nama sekolah"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
      <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
        Data {itemsPerPage * (currentPage - 1) + 1} -{" "}
        {Math.min(itemsPerPage * currentPage, totalItems)} dari {totalItems}
      </p>
      <ul className="list-none">
        {sekolah.map((item) => (
          <li
            key={item.id}
            className={`mb-4 p-4 bg-gray-50 rounded-lg shadow-sm ${
              editingId === item.id
                ? "bg-yellow-100"
                : "bg-gray-50 dark:bg-gray-700"
            }`}
          >
            <span className="block text-gray-900 font-semibold mb-2 dark:text-white">
              {item.nama.toUpperCase()} <br />
              Kota: {item.kota} <br />
              Jumlah Siswa: {item.jumlah_siswa} <br />
              Jumlah Kelulusan: {item.jumlah_kelulusan} (
              {formatPercentage(item.jumlah_kelulusan, item.jumlah_siswa)}){" "}
              <br />
              Konsentrasi: {item.konsentrasi.map((k) => k.nama).join(", ")}{" "}
              {/* Menampilkan konsentrasi */}
            </span>
            <div className="mt-2 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() =>
                  onEdit(
                    item.id,
                    item.nama,
                    item.kota,
                    item.jumlah_siswa,
                    item.jumlah_kelulusan
                  )
                }
                className="relative overflow-hidden text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleEditKonsentrasi(item)}
                className="relative overflow-hidden text-sm bg-purple-300 text-purple-800 px-3 py-1 rounded-md hover:bg-purple-400 dark:bg-purple-600 dark:text-purple-200 dark:hover:bg-purple-500"
              >
                Edit Konsentrasi
              </button>
              <button
                onClick={() => onViewKompetensi(item.id, item.nama)}
                className="relative overflow-hidden text-sm bg-green-300 text-green-800 px-3 py-1 rounded-md hover:bg-green-400 dark:bg-green-600 dark:text-green-200 dark:hover:bg-green-500"
              >
                Cek Kompetensi
              </button>
              <button
                onClick={() => openModal(item.id)}
                className="relative overflow-hidden text-sm bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 dark:bg-red-600 dark:text-red-200 dark:hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <EditModal
        isOpen={isKonsentrasiModalOpen}
        onClose={handleKonsentrasiEditCancel}
      >
        {selectedSekolahId && (
          <SekolahKonsentrasiEditForm
            sekolahId={selectedSekolahId}
            currentKonsentrasi={selectedSekolahKonsentrasi}
            onSuccess={handleKonsentrasiEditSuccess}
            onCancel={handleKonsentrasiEditCancel}
          />
        )}
      </EditModal>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
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

const formatPercentage = (numerator: number, denominator: number): string => {
  if (denominator === 0) return "0%";
  return ((numerator / denominator) * 100).toFixed(2) + "%";
};

export default SekolahList;
