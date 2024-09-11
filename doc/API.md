# Frontend API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Base Configuration](#base-configuration)
3. [Authentication](#authentication)
4. [User Management](#user-management)
5. [Okupasi (Occupation) Management](#okupasi-occupation-management)
6. [Sekolah (School) Management](#sekolah-school-management)
7. [Error Handling](#error-handling)

## Introduction

This documentation outlines the API endpoints and functions available for the frontend application. It covers authentication, user management, occupation management, and school management functionalities.

## Base Configuration

The base URL for all API requests is defined in the environment variable `VITE_API_BASE_URL`. All requests are made using Axios, with the following default configuration:

```typescript
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
```

## Authentication

### Login
- **Function:** `login(email: string, password: string)`
- **Endpoint:** POST `/user/login`
- **Description:** Authenticates a user and manages token storage and refresh.

### Logout
- **Function:** `logout()`
- **Endpoint:** POST `/user/logout`
- **Description:** Logs out the user and clears session data.

### Refresh Token
- **Function:** `refreshToken()`
- **Endpoint:** PUT `/authentication/refresh`
- **Description:** Refreshes the authentication token.

### Check Super User Status
- **Function:** `isUserSuper(): boolean`
- **Description:** Checks if the current user is a super user.

## User Management

### Get All Users
- **Function:** `getAllUsers()`
- **Endpoint:** GET `/user`
- **Description:** Retrieves a list of all users.

### Create User
- **Function:** `createUser(nama: string, email: string, password: string)`
- **Endpoint:** POST `/user`
- **Description:** Creates a new user account.

### Delete User
- **Function:** `deleteUser(id: string)`
- **Endpoint:** DELETE `/user/${id}`
- **Description:** Deletes a user account by ID.

### Change Email
- **Function:** `changeEmail(email: string)`
- **Endpoint:** PATCH `/user/email`
- **Description:** Updates the email address of the current user.

### Change Password
- **Function:** `changePassword(password: string)`
- **Endpoint:** PATCH `/user/password`
- **Description:** Updates the password of the current user.

## Okupasi (Occupation) Management

### Add Okupasi
- **Function:** `addOkupasi(kode: string, nama: string, unitKompetensi: Array<{ kode_unit: string; nama: string; standard_kompetensi: string }>)`
- **Endpoint:** POST `/okupasi`
- **Description:** Adds a new occupation with associated competency units.

### Get All Okupasi
- **Function:** `getAllOkupasi(search?: string, limit?: number, page?: number)`
- **Endpoint:** GET `/okupasi`
- **Description:** Retrieves a list of occupations with optional search and pagination.

### Get Okupasi By Kode
- **Function:** `getOkupasiByKode(kode: string)`
- **Endpoint:** GET `/okupasi/${kode}`
- **Description:** Retrieves details of a specific occupation by its code.

### Update Okupasi
- **Function:** `updateOkupasi(kode: string, newData: { kode?: string; nama?: string })`
- **Endpoint:** PUT `/okupasi/${kode}`
- **Description:** Updates an existing occupation's details.

### Delete Okupasi
- **Function:** `deleteOkupasi(kode: string)`
- **Endpoint:** DELETE `/okupasi/${kode}`
- **Description:** Deletes an occupation by its code.

### Add Unit Kompetensi
- **Function:** `addUnitKompetensi(kode: string, unitKompetensi: { kode_unit: string; nama: string; standard_kompetensi: string })`
- **Endpoint:** POST `/okupasi/${kode}/unit-kompetensi`
- **Description:** Adds a new competency unit to an existing occupation.

### Update Unit Kompetensi
- **Function:** `updateUnitKompetensi(kode: string, id: string, unitKompetensi: { kode_unit?: string; nama?: string; standard_kompetensi?: string })`
- **Endpoint:** PUT `/okupasi/${kode}/unit-kompetensi/${id}`
- **Description:** Updates an existing competency unit.

### Delete Unit Kompetensi
- **Function:** `deleteUnitKompetensi(kode: string, id: string)`
- **Endpoint:** DELETE `/okupasi/${kode}/unit-kompetensi/${id}`
- **Description:** Deletes a competency unit from an occupation.

## Sekolah (School) Management

### Add Sekolah
- **Function:** `addSekolah(nama: string, kota: string, jumlah_siswa: number, jumlah_kelulusan: number)`
- **Endpoint:** POST `/sekolah`
- **Description:** Adds a new school to the system.

### Get All Sekolah
- **Function:** `getAllSekolah(search?: string, limit?: number, page?: number)`
- **Endpoint:** GET `/sekolah`
- **Description:** Retrieves a list of schools with optional search and pagination.

### Get Sekolah By Id
- **Function:** `getSekolahById(id: string)`
- **Endpoint:** GET `/sekolah/${id}`
- **Description:** Retrieves details of a specific school by its ID.

### Edit Sekolah
- **Function:** `editSekolahById(id: string, nama: string, kota: string, jumlah_siswa: number, jumlah_kelulusan: number)`
- **Endpoint:** PUT `/sekolah/${id}`
- **Description:** Updates an existing school's information.

### Delete Sekolah
- **Function:** `deleteSekolahById(id: string)`
- **Endpoint:** DELETE `/sekolah/${id}`
- **Description:** Deletes a school from the system.

### Add Kompetensi to Sekolah
- **Function:** `addKompetensi(id: string, kode: string, unit_kompetensi: Array<{ id: string }>)`
- **Endpoint:** POST `/sekolah/${id}/kompetensi`
- **Description:** Adds competency units to a school.

### Get All Kompetensi for Sekolah
- **Function:** `getAllKompetensi(id: string, search?: string, limit?: number, page?: number)`
- **Endpoint:** GET `/sekolah/${id}/kompetensi`
- **Description:** Retrieves all competencies associated with a school.

### Edit Kompetensi for Sekolah
- **Function:** `editKompetensi(id: string, kode: string, unit_kompetensi: Array<{ id: string }>)`
- **Endpoint:** PUT `/sekolah/${id}/kompetensi`
- **Description:** Updates competency units for a school.

### Delete Kompetensi By Kode Okupasi
- **Function:** `deleteKompetensiByKodeOkupasi(id: string, kode: string)`
- **Endpoint:** DELETE `/sekolah/${id}/kompetensi/okupasi/${kode}`
- **Description:** Deletes competencies associated with a specific occupation code from a school.

### Delete Kompetensi By Id
- **Function:** `deleteKompetensiById(id: string, idUnit: string)`
- **Endpoint:** DELETE `/sekolah/${id}/kompetensi/unit/${idUnit}`
- **Description:** Deletes a specific competency unit from a school.

### Get All Sekolah Stat By Kode Okupasi
- **Function:** `getAllSekolahStatByKodeOkupasi(kode: string, search?: string, limit?: number, page?: number)`
- **Endpoint:** GET `/sekolah/stat/okupasi/${kode}`
- **Description:** Retrieves statistics for schools based on an occupation code.

## Error Handling

All API functions use a common error handling mechanism:

```typescript
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw error.response ? error.response.data : new Error('An error occurred');
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};
```

This ensures consistent error handling across all API calls, providing meaningful error messages for debugging and user feedback.