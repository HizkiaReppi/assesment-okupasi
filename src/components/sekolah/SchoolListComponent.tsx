import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface School {
  id: string;
  nama: string;
  kota: string;
}

interface SchoolListComponentProps {
  schools: School[];
  handleEdit: (school: School) => void;
  handleDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  editId: string | null; // Prop untuk ID sekolah yang sedang diedit
}

const SchoolListComponent: React.FC<SchoolListComponentProps> = ({
  schools,
  handleEdit,
  handleDelete,
  currentPage,
  totalPages,
  handlePageChange,
  editId, // Terima prop editId
}) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Daftar Sekolah</h2>
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-1/3">Nama</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-1/3">Kota</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-1/12">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr
              key={school.id}
              className={`hover:bg-gray-100 ${editId === school.id ? 'bg-gray-200' : ''}`} // Gunakan warna yang lebih gelap jika sedang diedit
            >
              <td className="text-gray-700 py-3 px-4 border-b border-gray-200">{school.nama}</td>
              <td className="text-gray-700 py-3 px-4 border-b border-gray-200">{school.kota}</td>
              <td className="py-3 px-4 border-b border-gray-200 text-center">
                <button
                  onClick={() => handleEdit(school)}
                  className="text-blue-500 hover:text-blue-700 p-2"
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(school.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
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
            className={`px-4 py-2 mx-2 rounded font-bold ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SchoolListComponent;
