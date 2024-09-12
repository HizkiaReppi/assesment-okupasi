import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaGraduationCap } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import { getAllOkupasi } from "../api/okupasi-api";
import { useFormContext } from "../context/FormContext";
import { getAllSekolahStatByKodeOkupasi } from "../api/sekolah-api";
import hoverImagePeta from "../assets/bg2.webp";
import HoverEffect from "../components/HoverEffect";

const FormPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setKodeOkupasi, setSchools, kodeOkupasi } = useFormContext();
  const [selectedKode, setSelectedKode] = useState<string>(kodeOkupasi || "");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!selectedKode) return;
    setIsLoading(true);
    try {
      const data = await getAllSekolahStatByKodeOkupasi(selectedKode);
      if (data.status === "success") {
        setSchools(data.data);
        setKodeOkupasi(selectedKode);
        navigate("/home");
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOkupasi = useCallback(async () => {
    try {
      const data = await getAllOkupasi();
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching okupasi:", error);
      return [];
    }
  }, []);

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <HoverEffect image={hoverImagePeta} sectionName="form">
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-40 backdrop-filter backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-30 dark:border-gray-700 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-8"
          >
            <FaGraduationCap className="text-6xl text-gray-800 dark:text-gray-200" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center"
          >
            Cari Nama Okupasi
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <SearchBar
              placeholder="Masukkan Nama Okupasi"
              fetchData={fetchOkupasi}
              initialValue={kodeOkupasi}
              onSearch={setSelectedKode}
              searchBarValue={selectedKode}
              setSearchBarValue={setSelectedKode}
              onKeyDown={handleSearchEnter}
            />
            <motion.div 
              className="flex justify-center mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={handleSearch}
                className={`w-full py-4 px-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-lg shadow-md hover:from-gray-800 hover:to-gray-950 transition duration-300 flex items-center justify-center ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSearch className="mr-2" />
                  </motion.div>
                ) : (
                  <FaSearch className="mr-2" />
                )}
                {isLoading ? "Memuat..." : "Search"}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </HoverEffect>
  );
};

export default FormPage;