import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUser } from '../api/api'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createUser(username, email, password);
      toast.success('Berhasil menambahkan anggota');
      setTimeout(() => {
        navigate('/home'); 
      }, 2000); 
    } catch (err) {
      const errorMessage = (err as Error).message || 'Terjadi kesalahan, silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#fef7f7]">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Tambah User Baru</h2>
        <img src="src/assets/google-logo.png" alt="Google Logo" className="w-12 mx-auto mb-6" />
        <div className="flex items-center justify-center mb-6">
          <div className="w-1/4 h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-500">atau</span>
          <div className="w-1/4 h-px bg-gray-300"></div>
        </div>
        <form className="space-y-4" onSubmit={handleSignUp}>
          {error && <div className="text-red-500">{error}</div>}
          <div className="relative">
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full p-3 border rounded-lg bg-[#fef7f7] focus:outline-none focus:border-[#d1815b]"
              placeholder="Username"
            />
          </div>
          <div className="relative">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-3 border rounded-lg bg-[#fef7f7] focus:outline-none focus:border-[#d1815b]"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-3 border rounded-lg bg-[#fef7f7] focus:outline-none focus:border-[#d1815b]"
              placeholder="Kata Sandi"
            />
            <div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button 
            type="submit" 
            className={`w-full bg-[#d1815b] text-white p-3 rounded-lg font-semibold hover:bg-[#b86842] transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Daftar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
