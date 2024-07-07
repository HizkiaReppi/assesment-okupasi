import { useEffect, useState } from "react";
import { getAllOkupasi, deleteOkupasi } from "../../api/okupasi-api";
import ConfirmationModal from "../ConfirmationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface OkupasiListProps {
  onEdit: (kode: string) => void;
  onViewUnits: (kode: string) => void;
  refresh: boolean;
}

const OkupasiList: React.FC<OkupasiListProps> = ({
  onEdit,
  onViewUnits,
  refresh,
}) => {
  const [okupasi, setOkupasi] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteKode, setDeleteKode] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllOkupasi(searchQuery, itemsPerPage, currentPage);
      if (data && data.status === "success") {
        setOkupasi(data.data);
        setTotalItems(data.total_result);
      } else {
        console.error("Data is not valid:", data);
      }
    };

    fetchData();
  }, [refresh, searchQuery, currentPage]);

  const handleDelete = async () => {
    if (!deleteKode) return;

    try {
      await deleteOkupasi(deleteKode);
      const deletedItem = okupasi.find((item) => item.kode === deleteKode);
      setOkupasi(okupasi.filter((item) => item.kode !== deleteKode));
      toast.error(
        `Item dengan kode ${deletedItem.kode} dan nama ${deletedItem.nama} berhasil dihapus.`,
        {
          position: "bottom-right",
        }
      );
      closeModal();
    } catch (error) {
      console.error("Error deleting Okupasi:", error);
    }
  };

  const openModal = (kode: string) => {
    setDeleteKode(kode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDeleteKode(null);
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Okupasi</h2>
      <input
        type="text"
        placeholder="Cari nama okupasi"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />
      <p className="text-sm text-gray-600 mb-4">
        Data {itemsPerPage * (currentPage - 1) + 1} - {Math.min(itemsPerPage * currentPage, totalItems)} dari {totalItems}
      </p>
      <ul className="list-none">
        {okupasi.map((item) => (
          <li
            key={item.kode}
            className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <span className="block text-gray-900 font-semibold mb-2">
              {item.nama.toUpperCase()} <br />
              Kode: {item.kode}
            </span>

            <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => onEdit(item.kode)}
                className="relative overflow-hidden text-sm bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 before:absolute before:inset-0 before:bg-gray-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
              >
                Edit
              </button>
              <button
                onClick={() => onViewUnits(item.kode)}
                className="relative overflow-hidden text-sm bg-blue-300 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-400 before:absolute before:inset-0 before:bg-blue-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
              >
                Cek Kompetensi
              </button>
              <button
                onClick={() => openModal(item.kode)}
                className="relative overflow-hidden text-sm bg-red-300 text-red-800 px-3 py-1 rounded-md hover:bg-red-400 before:absolute before:inset-0 before:bg-red-400 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-30 before:rounded-full before:scale-0 hover:before:scale-150 before:blur"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
              currentPage === i + 1
                ? "bg-gray-500 text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative overflow-hidden text-sm px-3 py-1 mx-1 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Next
        </button>
      </div>
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
