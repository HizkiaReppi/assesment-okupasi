import React, { useState, useEffect, useRef } from 'react';
import { FaDoorOpen, FaBars, FaCaretDown } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentApi, Assessment } from '../api/assessment-api';
import LogoutButton from './Logout';
import DarkModeToggle from './DarkModeToggle';
import LogoImage from '../assets/icon.png';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);
  const [assessmentDropdownOpen, setAssessmentDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1080);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const { isLoggedIn, isSuperAdmin } = useAuth();
  const location = useLocation();
  const dataDropdownRef = useRef<HTMLDivElement>(null);
  const assessmentDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDataDropdown = () => {
    setDataDropdownOpen(!dataDropdownOpen);
    setAssessmentDropdownOpen(false);
    setSettingsDropdownOpen(false);
  };
  const toggleAssessmentDropdown = () => {
    setAssessmentDropdownOpen(!assessmentDropdownOpen);
    setDataDropdownOpen(false);
    setSettingsDropdownOpen(false);
  };
  const toggleSettingsDropdown = () => {
    setSettingsDropdownOpen(!settingsDropdownOpen);
    setDataDropdownOpen(false);
    setAssessmentDropdownOpen(false);
  };

  const getLinkClasses = (path: string) => {
    return location.pathname === path
      ? 'text-orange-700 border-b-2 border-orange-700 font-medium dark:text-orange-500'
      : 'text-gray-800 hover:text-orange-700 transition duration-300 font-medium dark:text-gray-200 dark:hover:text-orange-500';
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const fetchedAssessments = await assessmentApi.getAll();
        setAssessments(fetchedAssessments);
      } catch (error) {
        console.error('Failed to fetch assessments:', error);
      }
    };

    if (isLoggedIn) {
      fetchAssessments();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1080);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        assessmentDropdownRef.current &&
        !assessmentDropdownRef.current.contains(event.target as Node)
      ) {
        setAssessmentDropdownOpen(false);
      }
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target as Node)
      ) {
        setSettingsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderDataDropdown = () => (
    <div
      className='relative'
      ref={dataDropdownRef}
    >
      <button
        onClick={toggleDataDropdown}
        className='text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center dark:text-gray-200 dark:hover:text-orange-500'
      >
        Data <FaCaretDown className='ml-1' />
      </button>
      {dataDropdownOpen && (
        <div className='absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10 dark:bg-gray-700'>
          <Link
            to='/data-sekolah'
            className='block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'
            onClick={() => setDataDropdownOpen(false)}
          >
            Data Sekolah
          </Link>
          <Link
            to='/data-okupasi'
            className='block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'
            onClick={() => setDataDropdownOpen(false)}
          >
            Data Okupasi
          </Link>
          <Link
            to='/data-konsentrasi'
            className='block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'
            onClick={() => setDataDropdownOpen(false)}
          >
            Data Konsentrasi
          </Link>
        </div>
      )}
    </div>
  );

  const renderAssessmentDropdown = () => (
    <div
      className='relative'
      ref={assessmentDropdownRef}
    >
      <button
        onClick={toggleAssessmentDropdown}
        className='text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center dark:text-gray-200 dark:hover:text-orange-500'
      >
        Assessment <FaCaretDown className='ml-1' />
      </button>
      {assessmentDropdownOpen && (
        <div className='absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10 dark:bg-gray-700'>
          {assessments.map((assessment) => (
            <a
              key={assessment.id}
              href={assessment.url}
              target='_blank'
              rel='noopener noreferrer'
              className='block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'
            >
              {assessment.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettingsDropdown = () => (
    <div
      className='relative'
      ref={settingsDropdownRef}
    >
      <button
        onClick={toggleSettingsDropdown}
        className='text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center dark:text-gray-200 dark:hover:text-orange-500'
      >
        Settings <FaCaretDown className='ml-1' />
      </button>
      {settingsDropdownOpen && (
        <div className='absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10 dark:bg-gray-700'>
          {isSuperAdmin && (
            <Link
              to='/pengguna'
              className='block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'
              onClick={() => setSettingsDropdownOpen(false)}
            >
              User Settings
            </Link>
          )}
          <Link
            to='/assesment'
            className='block px-4 py-2 text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600'
            onClick={() => setSettingsDropdownOpen(false)}
          >
            Assessment Settings
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav className='fixed w-full z-50 bg-white shadow-md dark:bg-gray-800'>
      <div className='flex justify-between items-center px-6 py-4'>
        <div className='flex items-center'>
          <Link to='/'>
            <img
              src={LogoImage}
              alt='Logo'
              className='h-10'
            />
          </Link>
        </div>
        {isMobile ? (
          <div
            className='flex'
            onClick={toggleMenu}
          >
            <FaBars className='text-gray-800 hover:text-orange-700 transition duration-300 dark:text-white' />
          </div>
        ) : (
          <div className='flex items-center space-x-6'>
            <Link
              to='/'
              className={getLinkClasses('/')}
            >
              Home
            </Link>
            {isLoggedIn && (
              <>
                {renderDataDropdown()}
                {renderAssessmentDropdown()}
                {renderSettingsDropdown()}
              </>
            )}
            <DarkModeToggle />
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Link
                to='/login'
                className={`text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center dark:text-gray-200 dark:hover:text-orange-500 ${getLinkClasses(
                  '/login',
                )}`}
              >
                <FaDoorOpen className='mr-2' /> Login
              </Link>
            )}
          </div>
        )}
      </div>
      {isMobile && menuOpen && (
        <div className='bg-white w-full absolute top-16 left-0 right-0 shadow-md z-10 flex flex-col items-center space-y-4 py-4 dark:bg-gray-800'>
          <Link
            to='/'
            className={getLinkClasses('/')}
            onClick={toggleMenu}
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              {renderDataDropdown()}
              {renderAssessmentDropdown()}
              {renderSettingsDropdown()}
            </>
          )}
          {!isLoggedIn && (
            <Link
              to='/login'
              className={`text-gray-800 hover:text-orange-700 transition duration-300 font-medium flex items-center dark:text-gray-200 dark:hover:text-orange-500 ${getLinkClasses(
                '/login',
              )}`}
              onClick={toggleMenu}
            >
              <FaDoorOpen className='mr-2' /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
