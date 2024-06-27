import { getAllSekolahStatByKodeOkupasi } from "../api/sekolah-api";
import { getAllOkupasi } from "../api/okupasi-api";
import { geocodeAddress } from "../utils/geocodeAddress";

interface Kompetensi {
  id: string;
  nama: string;
}

interface Okupasi {
  kode: string;
  nama: string;
  unit_kompetensi: Kompetensi[];
}

interface School {
  id: string;
  nama: string;
  kota: string;
  kecocokan: string;
  okupasi: Okupasi;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export const fetchSchoolsByOkupasi = async (
  selectedKode: string,
  searchQuery: string = "",
  limit: number = 10
): Promise<{ result: any[]; selectedOkupasi: Okupasi | undefined }> => {
  const okupasiData = await getAllOkupasi();
  const selectedOkupasi = okupasiData.data.find(
    (okupasi: Okupasi) => okupasi.kode === selectedKode
  );

  let allResults: any[] = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData && allResults.length < limit) {
    const data = await getAllSekolahStatByKodeOkupasi(selectedKode, searchQuery, limit, page);

    if (data.status === "success" && data.data && data.data.length > 0) {
      const pageResults = await Promise.all(
        data.data.map(async (school: School) => {
          const address = `${school.nama}, ${school.kota}, Indonesia`;
          const coordinates: Coordinates = await geocodeAddress(address);
          return {
            id: school.id,
            nama: school.nama,
            kota: school.kota,
            lat: coordinates.lat,
            lng: coordinates.lng,
            kecocokan: parseFloat(school.kecocokan).toFixed(2),
            okupasi: school.okupasi,
          };
        })
      );
      allResults = [...allResults, ...pageResults];
      page += 1;
      if (pageResults.length < limit) {
        hasMoreData = false; // Tidak ada data lebih lanjut untuk diambil
      }
    } else {
      hasMoreData = false; // Tidak ada data lebih lanjut untuk diambil
    }
  }

  allResults.sort((a, b) => parseFloat(b.kecocokan) - parseFloat(a.kecocokan));
  const limitedResults = allResults.slice(0, limit);
  return { result: limitedResults, selectedOkupasi };
};

export const fetchOkupasi = async (): Promise<Okupasi[]> => {
  const data = await getAllOkupasi();
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
};
