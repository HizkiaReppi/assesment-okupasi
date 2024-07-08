import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDoorClosed } from 'react-icons/fa';
import { logout } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggedIn(false);
      sessionStorage.removeItem('isLoggedIn');
      navigate('/login');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    handleLogout();
    closeModal();
  };

  return (
    <>
      <button 
        className="text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center" 
        onClick={openModal}
      >
        <FaDoorClosed className="mr-2" /> Logout
      </button>
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={confirmLogout} 
        message="Apakah anda ingin logout?"
      />
    </>
  );
};

export default LogoutButton;
