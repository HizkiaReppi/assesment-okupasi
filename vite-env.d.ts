/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_LOCATION_IQ_API_KEY: string;
    readonly VITE_MAPS_API_KEY: string;
    // tambahkan variabel lingkungan lain yang kamu gunakan di sini
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  