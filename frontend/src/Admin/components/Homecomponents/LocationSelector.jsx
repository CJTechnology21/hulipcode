import { useState, useEffect } from "react";
import { FiMapPin, FiX } from "react-icons/fi";
import {
  FaBuilding,
  FaLandmark,
  FaMonument,
  FaCity,
  FaUniversity,
} from "react-icons/fa";
import { useLocation } from "../../../context/LocationContext";

const cityData = [
  { name: "Bengaluru", icon: <FaBuilding />, pincode: "560001" },
  { name: "Chennai", icon: <FaUniversity />, pincode: "600001" },
  { name: "Delhi", icon: <FaLandmark />, pincode: "110001" },
  { name: "Mumbai", icon: <FaMonument />, pincode: "400001" },
  { name: "Hyderabad", icon: <FaCity />, pincode: "500001" },
  { name: "Ahmedabad", icon: <FaBuilding />, pincode: "380001" },
];

export default function LocationSelector() {
  const { location, setLocation } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualPin, setManualPin] = useState("");

  // 🔁 Check localStorage first before using GPS
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else {
      fetchFromGPS();
    }
  }, []);

  const fetchCityFromPin = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        return {
          city: data[0].PostOffice[0].District,
          state: data[0].PostOffice[0].State,
        };
      }
    } catch (err) {
      console.error("City fetch error:", err);
    }
    return { city: "Unknown", state: "" };
  };

  const fetchFromGPS = () => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        const pincode = data.address?.postcode;
        if (pincode?.length === 6) {
          const { city } = await fetchCityFromPin(pincode);
          const loc = { city, pincode };
          setLocation(loc);
          localStorage.setItem("userLocation", JSON.stringify(loc));
        } else {
          setLocation({ city: "Unknown", pincode: "----" });
        }
      } catch {
        setLocation({ city: "Unknown", pincode: "----" });
      }
    });
  };

  const handleManualApply = async (e) => {
    e.preventDefault();
    if (manualPin.length === 6) {
      const { city } = await fetchCityFromPin(manualPin);
      const loc = { city, pincode: manualPin };
      setLocation(loc);
      localStorage.setItem("userLocation", JSON.stringify(loc)); // ✅ Save to localStorage
      setIsModalOpen(false);
    } else {
      alert("Please enter a valid 6-digit pincode");
    }
  };

  const handleCitySelect = async (name, pin) => {
    const { city } = await fetchCityFromPin(pin);
    const loc = { city, pincode: pin };
    setLocation(loc);
    localStorage.setItem("userLocation", JSON.stringify(loc)); // ✅ Save to localStorage
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="flex items-center gap-2 cursor-pointer font-semibold text-black"
        onClick={() => setIsModalOpen(true)}
      >
        <FiMapPin className="text-xl" />
        <div className="leading-tight">
          <div className="text-sm">{location.city || "Fetching..."}</div>
          <div className="text-xs text-gray-600">{location.pincode}</div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-md relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Enter your Delivery Pincode
            </h2>

            <form className="flex gap-2 mb-4" onSubmit={handleManualApply}>
              <input
                type="text"
                placeholder="Enter Pincode"
                value={manualPin}
                onChange={(e) => setManualPin(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold"
              >
                Apply
              </button>
            </form>

            <button
              onClick={fetchFromGPS}
              className="flex items-center gap-2 border px-4 py-2 rounded w-full mb-4 text-sm text-gray-700"
            >
              <FiMapPin /> Get current location{" "}
              <span className="text-gray-400">(Using GPS)</span>
            </button>

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              {cityData.map(({ name, icon, pincode }) => (
                <div
                  key={name}
                  onClick={() => handleCitySelect(name, pincode)}
                  className="border rounded p-3 hover:shadow cursor-pointer flex flex-col items-center"
                >
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-medium">{name}</div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Allowing location access helps us curate options that can be delivered to you.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
// import { useState, useEffect } from "react";
// import { FiMapPin, FiX } from "react-icons/fi";
// import {
//   FaBuilding,
//   FaLandmark,
//   FaMonument,
//   FaCity,
//   FaUniversity,
// } from "react-icons/fa";

// // ⬇️ Import global context
// import { useLocation } from "../../../context/LocationContext";

// const cityData = [
//   { name: "Bengaluru", icon: <FaBuilding />, pincode: "560001" },
//   { name: "Chennai", icon: <FaUniversity />, pincode: "600001" },
//   { name: "Delhi", icon: <FaLandmark />, pincode: "110001" },
//   { name: "Mumbai", icon: <FaMonument />, pincode: "400001" },
//   { name: "Hyderabad", icon: <FaCity />, pincode: "500001" },
//   { name: "Ahmedabad", icon: <FaBuilding />, pincode: "380001" },
// ];

// export default function LocationSelector() {
//   const { location, setLocation } = useLocation(); // 🔄 from global context
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [manualPin, setManualPin] = useState("");

//   useEffect(() => {
//     fetchFromGPS();
//   }, []);

//   // 🧠 Get city using India Post API
//   const fetchCityFromPin = async (pin) => {
//     try {
//       const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
//       const data = await res.json();
//       if (
//         data[0].Status === "Success" &&
//         data[0].PostOffice?.length > 0
//       ) {
//         return {
//           city: data[0].PostOffice[0].District,
//           state: data[0].PostOffice[0].State,
//         };
//       }
//     } catch (err) {
//       console.error("City fetch error:", err);
//     }
//     return { city: "Unknown", state: "" };
//   };

//   // 📍 GPS-based fetch
//   const fetchFromGPS = () => {
//     navigator.geolocation?.getCurrentPosition(async (pos) => {
//       const { latitude, longitude } = pos.coords;
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//         );
//         const data = await res.json();
//         const pincode = data.address?.postcode;
//         if (pincode?.length === 6) {
//           const { city } = await fetchCityFromPin(pincode);
//           setLocation({ city, pincode });
//         } else {
//           setLocation({ city: "Unknown", pincode: "----" });
//         }
//       } catch {
//         setLocation({ city: "Unknown", pincode: "----" });
//       }
//     });
//   };

//   // 📝 Manual pin entry
//   const handleManualApply = async (e) => {
//     e.preventDefault();
//     if (manualPin.length === 6) {
//       const { city } = await fetchCityFromPin(manualPin);
//       setLocation({ city, pincode: manualPin });
//       setIsModalOpen(false);
//     } else {
//       alert("Please enter a valid 6-digit pincode");
//     }
//   };

//   // 🏙 City quick select
//   const handleCitySelect = async (name, pin) => {
//     const { city } = await fetchCityFromPin(pin);
//     setLocation({ city, pincode: pin });
//     setIsModalOpen(false);
//   };

//   return (
//     <>
//       {/* Location Display Trigger */}
//       <div
//         className="flex items-center gap-2 cursor-pointer font-semibold text-black"
//         onClick={() => setIsModalOpen(true)}
//       >
//         <FiMapPin className="text-xl" />
//         <div className="leading-tight">
//           <div className="text-sm">{location.city || "Fetching..."}</div>
//           <div className="text-xs text-gray-600">{location.pincode}</div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[95%] max-w-md relative shadow-lg">
//             {/* Close Button */}
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-3 right-3 text-gray-500"
//             >
//               <FiX size={20} />
//             </button>

//             <h2 className="text-lg font-semibold mb-4">
//               Enter your Delivery Pincode
//             </h2>

//             {/* Manual Pincode Entry */}
//             <form className="flex gap-2 mb-4" onSubmit={handleManualApply}>
//               <input
//                 type="text"
//                 placeholder="Enter Pincode"
//                 value={manualPin}
//                 onChange={(e) => setManualPin(e.target.value)}
//                 className="border rounded px-3 py-2 flex-1"
//               />
//               <button
//                 type="submit"
//                 className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold"
//               >
//                 Apply
//               </button>
//             </form>

//             {/* GPS Location Button */}
//             <button
//               onClick={fetchFromGPS}
//               className="flex items-center gap-2 border px-4 py-2 rounded w-full mb-4 text-sm text-gray-700"
//             >
//               <FiMapPin /> Get current location{" "}
//               <span className="text-gray-400">(Using GPS)</span>
//             </button>

//             {/* Quick City Selector */}
//             <div className="grid grid-cols-3 gap-4 text-center text-sm">
//               {cityData.map(({ name, icon, pincode }) => (
//                 <div
//                   key={name}
//                   onClick={() => handleCitySelect(name, pincode)}
//                   className="border rounded p-3 hover:shadow cursor-pointer flex flex-col items-center"
//                 >
//                   <div className="text-xl mb-1">{icon}</div>
//                   <div className="font-medium">{name}</div>
//                 </div>
//               ))}
//             </div>

//             <p className="text-xs text-gray-500 mt-4">
//               Allowing location access helps us curate options that can be delivered to you.
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
