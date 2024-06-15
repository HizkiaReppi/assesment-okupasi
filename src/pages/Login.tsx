import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      login(); // Update login status
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      if (error.response) {
        setError(error.response.data.error || 'Login failed');
      } else {
        setError('Login failed');
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
