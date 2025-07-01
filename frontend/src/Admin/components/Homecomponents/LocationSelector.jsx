
import { useState, useEffect } from "react";
import { FiMapPin, FiX } from "react-icons/fi";
import { FaBuilding, FaLandmark, FaMonument, FaCity, FaUniversity } from "react-icons/fa"; // Icons for cities

const cityData = [
  { name: "Bengaluru", icon: <FaBuilding />, pincode: "560001" },
  { name: "Chennai", icon: <FaUniversity />, pincode: "600001" },
  { name: "Delhi", icon: <FaLandmark />, pincode: "110001" },
  { name: "Mumbai", icon: <FaMonument />, pincode: "400001" },
  { name: "Hyderabad", icon: <FaCity />, pincode: "500001" },
  { name: "Ahmedabad", icon: <FaBuilding />, pincode: "380001" }
];

export default function LocationSelector() {
  const [location, setLocation] = useState({ city: "", pincode: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualPin, setManualPin] = useState("");

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.village;
        const pincode = data.address.postcode;
        setLocation({ city, pincode });
      } catch (err) {
        setLocation({ city: "Unknown", pincode: "----" });
      }
    });
  }, []);

  const handleManualApply = () => {
    if (manualPin.length === 6) {
      setLocation({ city: "Custom", pincode: manualPin });
      setIsModalOpen(false);
    }
  };

  const handleCitySelect = (cityName, pin) => {
    setLocation({ city: cityName, pincode: pin });
    setIsModalOpen(false);
  };

  const fetchFromGPS = () => {
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.village;
        const pincode = data.address.postcode;
        setLocation({ city, pincode });
        setIsModalOpen(false);
      } catch {
        alert("Failed to fetch location");
      }
    });
  };

  return (
    <>
      {/* Location Display */}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[95%] max-w-md relative shadow-lg">
            {/* Close Button */}
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500">
              <FiX size={20} />
            </button>

            {/* Modal Title */}
            <h2 className="text-lg font-semibold mb-4">Enter your Delivery Pincode</h2>

            {/* Manual Entry */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter Pincode"
                value={manualPin}
                onChange={(e) => setManualPin(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold"
                onClick={handleManualApply}
              >
                Apply
              </button>
            </div>

            {/* GPS Fetch */}
            <button
              onClick={fetchFromGPS}
              className="flex items-center gap-2 border px-4 py-2 rounded w-full mb-4 text-sm text-gray-700"
            >
              <FiMapPin /> Get current location <span className="text-gray-400">(Using GPS)</span>
            </button>

            {/* City Selector Grid */}
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

            {/* Info Note */}
            <p className="text-xs text-gray-500 mt-4">
               Allowing location access helps us curate options that can be delivered to you.
            </p>
          </div>
        </div>
      )}
    </>
  );
}