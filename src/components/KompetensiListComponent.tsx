import React from 'react';

interface Kompetensi {
  id: string;
  kode: string;
  unit_kompetensi: { id: string }[];
}

interface KompetensiListComponentProps {
  kompetensi: Kompetensi[];
  handleEditKompetensi: (kompetensiId: string, kode: string, unit_kompetensi: { id: string }[]) => void;
  handleDeleteKompetensi: (kompetensiId: string) => void;
  handleViewStat: (kode: string) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const KompetensiListComponent: React.FC<KompetensiListComponentProps> = ({
  kompetensi,
  handleEditKompetensi,
  handleDeleteKompetensi,
  handleViewStat,
  currentPage,
  totalPages,
  handlePageChange
}) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Daftar Kompetensi</h2>
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="border p-2 w-1/4">Kode</th>
            <th className="border p-2 w-1/2">Unit Kompetensi</th>
            <th className="border p-2 w-1/12">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kompetensi.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.kode}</td>
              <td className="border p-2">
                {item.unit_kompetensi.map((unit) => (
                  <span key={unit.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {unit.id}
                  </span>
                ))}
              </td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-1 py-1 rounded mr-1"
                  onClick={() => handleEditKompetensi(item.id, item.kode, item.unit_kompetensi)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-1 py-1 rounded"
                  onClick={() => handleDeleteKompetensi(item.id)}
                >
                  Hapus
                </button>
                <button
                  className="bg-blue-500 text-white px-1 py-1 rounded ml-1"
                  onClick={() => handleViewStat(item.kode)}
                >
                  Lihat Stat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-4 py-2 mx-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KompetensiListComponent;
