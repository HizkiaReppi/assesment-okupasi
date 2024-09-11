let apiCallCount = 0;

export const geocodeAddress = async (address: string) => {
  const cachedResult = localStorage.getItem(`geocode_${address}`);
  if (cachedResult) {
    // console.log(`[Geocoding] Menggunakan data cache untuk alamat: ${address}`);
    return JSON.parse(cachedResult);
  }

  apiCallCount++;
  // console.log(`[Geocoding] Pemanggilan API #${apiCallCount} untuk alamat: ${address}`);

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${import.meta.env.VITE_MAPS_API_KEY}`
    );
    const data = await response.json();
    if (data && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      const result = { lat, lng };
      localStorage.setItem(`geocode_${address}`, JSON.stringify(result));
      return result;
    }
    throw new Error("Address not found");
  } catch (error) {
    console.error("Geocoding failed:", error);
    throw error;
  }
};