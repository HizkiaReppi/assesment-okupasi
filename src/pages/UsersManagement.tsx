import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';
import {
  createUser,
  getAllUsers,
  deleteUser,
  changeEmail,
  changePassword,
} from '../api/user-api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

interface User {
  id: string;
  nama: string;
  email: string;
}

const UsersManagement = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.status === 'success' && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Failed to fetch users: response data is not an array');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('Anda bukan superadmin');
      } else {
        console.error('Failed to fetch users:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUser(username, email, password);
      toast.success('Berhasil menambahkan anggota');
      fetchUsers();
      resetForm();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.error('Anda bukan superadmin');
      } else {
        const errorMessage =
          (err as Error).message || 'Terjadi kesalahan, silakan coba lagi.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setShowForm(false);
    }
  };

  const handleEditUser = (user: User) => {
    setUsername(user.nama);
    setEmail(user.email);
    setPassword('');
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (email) await changeEmail(email);
      if (password) await changePassword(password);
      toast.success('Berhasil memperbarui anggota');
      fetchUsers();
      resetForm();
      setIsEditing(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        toast.error('Anda bukan superadmin');
      } else {
        const errorMessage =
          (err as Error).message || 'Terjadi kesalahan, silakan coba lagi.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setShowForm(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setLoading(true);
    try {
      await deleteUser(id);
      toast.success('Berhasil menghapus anggota');
      fetchUsers();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error('Anda bukan superadmin');
      } else {
        console.error('Failed to delete user:', error);
        toast.error('Gagal menghapus anggota');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setIsEditing(false);
    setShowForm(false);
  };

  const handleAddUser = () => {
    resetForm();
    setShowForm(true);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 pt-20'>
      <ToastContainer />
      <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-6xl'>
        <h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200'>
          User Management
        </h2>
        <button
          className='bg-gray-600 text-white px-4 py-2 rounded-lg mb-4 flex items-center justify-center hover:bg-blue-700 transition duration-300'
          onClick={handleAddUser}
        >
          <FaPlus className='mr-2' /> Add User
        </button>
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg'>
            <thead>
              <tr className='bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal'>
                <th className='py-3 px-6 text-left'>Nomor</th>
                <th className='py-3 px-6 text-left'>Nama</th>
                <th className='py-3 px-6 text-left'>Email</th>
                <th className='py-3 px-6 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-gray-600 dark:text-gray-200 text-sm font-light'>
              {currentUsers.map((user: User, index) => (
                <tr
                  key={user.id}
                  className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  <td className='py-3 px-6 text-left'>{index + 1}</td>
                  <td className='py-3 px-6 text-left'>{user.nama}</td>
                  <td className='py-3 px-6 text-left'>{user.email}</td>
                  <td className='py-3 px-6 text-center flex justify-center space-x-4'>
                    <button
                      className='text-blue-500 hover:text-blue-700'
                      onClick={() => handleEditUser(user)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className='text-red-500 hover:text-red-700'
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-center mt-4'>
          {Array.from(
            { length: Math.ceil(users.length / usersPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-gray-400 dark:bg-gray-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                } hover:bg-orange-800 transition duration-300`}
              >
                {i + 1}
              </button>
            ),
          )}
        </div>
      </div>

      {showForm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg'>
          <div className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg relative z-10'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
                {isEditing ? 'Edit User' : 'Tambah User Baru'}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <FaTimes className='text-gray-600 dark:text-gray-200 hover:text-gray-800 transition duration-300' />
              </button>
            </div>
            <form
              className='space-y-4'
              onSubmit={isEditing ? handleUpdateUser : handleSignUp}
            >
              {error && <div className='text-red-500'>{error}</div>}
              <div className='relative'>
                <input
                  type='text'
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  required
                  className='w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:border-orange-500'
                  placeholder='Username'
                />
              </div>
              <div className='relative'>
                <input
                  type='email'
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  className='w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:border-orange-500'
                  placeholder='Email'
                />
              </div>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  className='w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:border-orange-500'
                  placeholder='Kata Sandi'
                />
                <div
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-200'
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <button
                type='submit'
                className={`w-full bg-orange-700 text-white p-3 rounded-lg font-semibold hover:bg-orange-800 transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Memuat...' : isEditing ? 'Perbarui' : 'Daftar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
