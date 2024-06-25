import { getAllKompetensi, getAllSekolahStatByKodeOkupasi } from "../api/sekolah-api";
import { getAllOkupasi } from "../api/okupasi-api";
import { geocodeAddress } from "../utils/geocodeAddress";

export const fetchSchoolsByOkupasi = async (selectedKode: string, searchQuery: string = "", limit: number = 100, page: number = 1) => {
  const data = await getAllSekolahStatByKodeOkupasi(selectedKode, searchQuery, limit, page);
  const okupasiData = await getAllOkupasi();
  const selectedOkupasi = okupasiData.data.find(
    (okupasi: any) => okupasi.kode === selectedKode
  );

  if (data.status === "success" && data.data) {
    const result = await Promise.all(
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

    result.sort((a, b) => parseFloat(b.kecocokan) - parseFloat(a.kecocokan));
    return { result, selectedOkupasi };
  } else {
    return { result: [], selectedOkupasi: null };
  }
};

export const fetchOkupasi = async () => {
  const data = await getAllOkupasi();
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
};
