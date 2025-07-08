// src/context/LocationContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({ city: "", pincode: "" });

  useEffect(() => {
    const fetchLocation = async () => {
      // ✅ 1. Check localStorage first
      const saved = localStorage.getItem("userLocation");
      if (saved) {
        setLocation(JSON.parse(saved));
        return; // 🔒 Don’t fetch GPS if manual exists
      }

      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "";
        const pincode = data.address.postcode || "";
        const loc = { city, pincode };

        setLocation(loc);
        localStorage.setItem("userLocation", JSON.stringify(loc)); // ✅ Save for future
      } catch (err) {
        setLocation({ city: "Unknown", pincode: "" });
      }
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

// // src/context/LocationContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";

// const LocationContext = createContext();

// export const LocationProvider = ({ children }) => {
//   const [location, setLocation] = useState({ city: "", pincode: "" });

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const pos = await new Promise((resolve, reject) =>
//           navigator.geolocation.getCurrentPosition(resolve, reject)
//         );
//         const { latitude, longitude } = pos.coords;
//         const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
//         const data = await res.json();
//         const city = data.address.city || data.address.town || data.address.village || "";
//         const pincode = data.address.postcode || "";
//         setLocation({ city, pincode });
//       } catch (err) {
//         setLocation({ city: "Unknown", pincode: "" });
//       }
//     };

//     fetchLocation();
//   }, []);

//   return (
//     <LocationContext.Provider value={{ location, setLocation }}>
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => useContext(LocationContext);
