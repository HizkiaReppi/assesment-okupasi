import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axiosInstance from '../api/axiosConfig'; // Pastikan path ini sesuai

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log('Attempting login with:', { email, password });
      const response = await axiosInstance.post('/user/login', {
        email,
        password
      });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role); // Simpan role pengguna
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        setError(error.response.data.errors[0].message || 'Login failed');
      } else if (error.request) {
        // Request was made but no response received
        console.error('Request data:', error.request);
        setError('No response from server');
      } else {
        // Something else caused an error
        console.error('Error', error.message);
        setError(error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#fef7f7]">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Masuk</h2>
        <img src="src/assets/google-logo.png" alt="Google Logo" className="w-12 mx-auto mb-6" />
        <div className="flex items-center justify-center mb-6">
          <div className="w-1/4 h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-500">atau</span>
          <div className="w-1/4 h-px bg-gray-300"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
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
          <div className="flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-gray-700">Ingat Saya</label>
          </div>
          <button type="submit" className="w-full bg-[#d1815b] text-white p-3 rounded-lg font-semibold hover:bg-[#b86842] transition duration-300">
            Masuk
          </button>
        </form>
        <div className="mt-4 text-[#d1815b] cursor-pointer hover:underline">
          Lupa kata sandi?
        </div>
        <div className="mt-4 text-gray-700">
          Belum punya akun? <Link to="/signup" className="text-[#d1815b] hover:underline">Daftar disini</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
