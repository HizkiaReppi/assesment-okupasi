import React from 'react';

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
}

const SchoolListComponent: React.FC<SchoolListComponentProps> = ({
  schools,
  handleEdit,
  handleDelete,
  currentPage,
  totalPages,
  handlePageChange
}) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Daftar Sekolah</h2>
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="border p-2 w-1/4">Nama</th>
            <th className="border p-2 w-1/4">Kota</th>
            <th className="border p-2 w-1/12">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id}>
              <td className="border p-2">{school.nama}</td>
              <td className="border p-2">{school.kota}</td>
              <td className="border p-2">
                <button
                  className="bg-yellow-500 text-white px-1 py-1 rounded mr-1"
                  onClick={() => handleEdit(school)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-1 py-1 rounded"
                  onClick={() => handleDelete(school.id)}
                >
                  Hapus
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

export default SchoolListComponent;
