import { getAllSekolahStatByKodeOkupasi, getAllSekolah } from "../api/sekolah-api";
import { getAllOkupasi } from "../api/okupasi-api";

interface UnitKompetensi {
  id: string;
  kode_unit: string;
  nama: string;
  standard_kompetensi: string;
}

interface Okupasi {
  kode: string;
  nama: string;
  unit_kompetensi: UnitKompetensi[];
}

export interface Konsentrasi {
  id: string;
  nama?: string;
}

export interface School {
  id: string;
  nama: string;
  kota: string;
  kecocokan: string;
  jumlah_siswa: number;
  jumlah_kelulusan: number;
  persentase_kelulusan: string;
  okupasi?: Okupasi;
  konsentrasi?: Konsentrasi[];
}

// Fetch data untuk ditampilkan di sidebar
export const fetchSchoolsByOkupasi = async (
  selectedKode: string,
  searchQuery: string = "",
  limit: number = 1000
): Promise<{ result: School[]; selectedOkupasi: Okupasi | undefined }> => {
  const okupasiData = await getAllOkupasi();
  const selectedOkupasi = okupasiData.data.find(
    (okupasi: Okupasi) => okupasi.kode === selectedKode
  );

  let allResults: School[] = [];
  let page = 1;
  let hasMoreData = true;

  // Fetch schools by okupasi
  while (hasMoreData && allResults.length < limit) {
    const data = await getAllSekolahStatByKodeOkupasi(selectedKode, searchQuery, limit, page);

    if (data.status === "success" && data.data && data.data.length > 0) {
      const pageResults: School[] = data.data.map((school: any) => ({
        id: school.id,
        nama: school.nama,
        kota: school.kota,
        kecocokan: parseFloat(school.kecocokan).toFixed(2),
        jumlah_siswa: school.jumlah_siswa,
        jumlah_kelulusan: school.jumlah_kelulusan,
        persentase_kelulusan: school.persentase_kelulusan,
        okupasi: school.okupasi ?? undefined,
        konsentrasi: [] as Konsentrasi[], 
      }));

      allResults = [...allResults, ...pageResults];
      page += 1;
      if (pageResults.length < limit) {
        hasMoreData = false; 
      }
    } else {
      hasMoreData = false; 
    }
  }

  // Fetch all schools to get concentration data
  const allSchoolsData = await getAllSekolah(searchQuery, limit);
  
  if (allSchoolsData && allSchoolsData.status === "success" && allSchoolsData.data) {
    // Create a map of school id to konsentrasi
    const schoolKonsentrasiMap = new Map<string, Konsentrasi[]>(
      allSchoolsData.data.map((school: any) => [
        school.id, 
        (school.konsentrasi || []).map((k: any) => ({ id: k.id, nama: k.nama }))
      ])
    );
    
    allResults = allResults.map(school => ({
      ...school,
      konsentrasi: schoolKonsentrasiMap.get(school.id) || [] as Konsentrasi[]
    }));
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