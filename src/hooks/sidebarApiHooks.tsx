import { getAllSekolahStatByKodeOkupasi } from "../api/sekolah-api";
import { getAllOkupasi } from "../api/okupasi-api";

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
  jumlah_siswa: number;
  jumlah_kelulusan: number;
  persentase_kelulusan: string;
  okupasi?: Okupasi;
}

export const fetchSchoolsByOkupasi = async (
  selectedKode: string,
  searchQuery: string = "",
  limit: number = 10
): Promise<{ result: School[]; selectedOkupasi: Okupasi | undefined }> => {
  const okupasiData = await getAllOkupasi();
  const selectedOkupasi = okupasiData.data.find(
    (okupasi: Okupasi) => okupasi.kode === selectedKode
  );

  let allResults: School[] = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData && allResults.length < limit) {
    const data = await getAllSekolahStatByKodeOkupasi(selectedKode, searchQuery, limit, page);

    if (data.status === "success" && data.data && data.data.length > 0) {
      const pageResults = data.data.map((school: any) => ({
        id: school.id,
        nama: school.nama,
        kota: school.kota,
        kecocokan: parseFloat(school.kecocokan).toFixed(2),
        jumlah_siswa: school.jumlah_siswa,
        jumlah_kelulusan: school.jumlah_kelulusan,
        persentase_kelulusan: school.persentase_kelulusan,
        okupasi: school.okupasi ?? null,
      }));

      allResults = [...allResults, ...pageResults];
      page += 1;
      if (pageResults.length < limit) {
        hasMoreData = false; // No more data available
      }
    } else {
      hasMoreData = false; // No more data available
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
