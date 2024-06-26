import { useState, MouseEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import hoverImagePeta from '../assets/FullMap.png'; // Import the hover image

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Hover state and handlers
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, section: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredSection(section);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
  };

  const renderHoverImage = (section: string, image: string) => {
    return (
      hoveredSection === section && (
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            clipPath: `circle(150px at ${hoverPosition.x}px ${hoverPosition.y}px)`,
            opacity: 0.8,
          }}
        ></div>
      )
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await login(email, password);
      if (response) {
        localStorage.setItem('token', response.token); // Save token to localStorage
        setIsLoggedIn(true);
        navigate('/home'); // Navigate to home page on successful login
      } else {
        setError('Login failed. Please check your email and password.');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'An error occurred, please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 relative overflow-hidden"
      onMouseMove={(e) => handleMouseMove(e, 'login')}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 sm:p-12 rounded-lg shadow-2xl text-center w-full max-w-md border border-white border-opacity-30 relative z-10">
        <h2 className="text-2xl font-bold mb-10 text-gray-800">LOGIN / MASUK</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-500">{error}</div>}
          <div className="relative">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-4 border border-gray-400 rounded-lg bg-white bg-opacity-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-4 border border-gray-400 rounded-lg bg-white bg-opacity-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Password"
            />
            <div 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button 
            type="submit" 
            className={`w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Login'}
          </button>
        </form>
      </div>
      {renderHoverImage('login', hoverImagePeta)}
    </div>
  );
};

export default Login;
