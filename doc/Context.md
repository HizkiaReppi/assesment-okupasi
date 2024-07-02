# Context Folder
```plaintext
context/
├── AuthContext.tsx
├── FormContext.tsx
```

### AuthContex.tsx
- **Deskripsi**: Bagian penting yang digunakan untuk handle authentikasi.
- **Penggunaan**: Modifikasi file ini jika ada kesalahan saat authentikasi atau refresh token
Mekanisme auth context adalah sebagai berikut. 
    - resetLogoutTimeout: Mengatur timeout untuk logout.
    - refreshAuthToken: Mengatur token untuk authentikasi.
    
    Keduanya berjalan terpisah, refresh token akan terus berjalan sesuai dengan waktu yang telah diatur, namun untuk resetlogouttimeout akan direset jika user melakukan aktivitas seperti scroll dan lainnya. User akan logout otomatis ketika resetlogouttimeout mencapai mencapai waktu yang ditentukan 
- **Status**: digunakan

### FormContext.tsx
- **Deskripsi**: Context yang digunakan untuk menghubungkan komponen searchbar dari formpage ke komponen sidebar di homepage.
- **Penggunaan**: -
- **Status**: digunakan
