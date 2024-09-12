import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
      <div
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden"
      >
        <div className="bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-40 backdrop-filter backdrop-blur-lg p-8 sm:p-12 rounded-lg shadow-2xl w-full max-w-md border border-white border-opacity-30 dark:border-gray-700 relative z-10">
          <h2 className="text-2xl font-bold mb-10 text-gray-800 dark:text-gray-200 text-center">
            Cari Nama Okupasi
          </h2>
          <div className="space-y-6">
            <SearchBar
              placeholder="Masukkan Nama Okupasi"
              fetchData={fetchOkupasi}
              initialValue={kodeOkupasi}
              onSearch={setSelectedKode}
              searchBarValue={selectedKode}
              setSearchBarValue={setSelectedKode}
              onKeyDown={handleSearchEnter}
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSearch}
                className={`w-full py-3 px-6 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Memuat..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </HoverEffect>
  );
};

export default FormPage;
