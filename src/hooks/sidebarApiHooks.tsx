import { getAllKompetensi, getAllSekolahStatByKodeOkupasi } from "../api/sekolah-api";
import { getAllOkupasi } from "../api/okupasi-api";
import { geocodeAddress } from "../utils/geocodeAddress";

export const fetchSchoolsByOkupasi = async (selectedKode: string, searchQuery: string = "", limit: number = 10) => {
  const okupasiData = await getAllOkupasi();
  const selectedOkupasi = okupasiData.data.find(
    (okupasi: any) => okupasi.kode === selectedKode
  );

  let allResults: any[] = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData && allResults.length < limit) {
    const data = await getAllSekolahStatByKodeOkupasi(selectedKode, searchQuery, limit, page);
    
    if (data.status === "success" && data.data && data.data.length > 0) {
      const pageResults = await Promise.all(
        data.data.map(async (school: any) => {
          const address = `${school.nama}, ${school.kota}, Indonesia`;
          const coordinates = await geocodeAddress(address);
          const kompetensiData = await getAllKompetensi(school.id);
          return {
            id: school.id,
            nama: school.nama,
            kota: school.kota,
            lat: coordinates.lat,
            lng: coordinates.lng,
            kecocokan: parseFloat(school.kecocokan).toFixed(2),
            kompetensi: kompetensiData.data,
          };
        })
      );
      allResults = [...allResults, ...pageResults];
      page += 1;
      if (pageResults.length < limit) {
        hasMoreData = false; // No more data to fetch
      }
    } else {
      hasMoreData = false; // No more data to fetch
    }
  }

  allResults.sort((a, b) => parseFloat(b.kecocokan) - parseFloat(a.kecocokan));
  const limitedResults = allResults.slice(0, limit);
  return { result: limitedResults, selectedOkupasi };
};

export const fetchOkupasi = async () => {
  const data = await getAllOkupasi();
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
};
