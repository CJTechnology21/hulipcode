import { useState, useEffect } from "react";
import logo from "../src/Admin/images/logo.jpg";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaApple,
  FaAndroid,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../src/client/components/CategoryBar";
import { useDispatch } from "react-redux";
import { clearCart } from "./app/features/cart/cartSlice";
import HomeComponent from "./Admin/components/Homecomponents/HomeComponent";
import LocationSelector from "./Admin/components/Homecomponents/LocationSelector";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    dispatch(clearCart);
    setIsLoggedIn(false);
    navigate("/login");
  };
  const [location, setLocation] = useState("Fetching...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const city =
              data.address.city || data.address.town || data.address.village;
            const postcode = data.address.postcode;
            setLocation(`${city}, ${postcode}`);
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Location unavailable");
          }
        },
        () => {
          setLocation("Permission denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  return (
    <div className="bg-white min-h-screen font-montreal">
      {/* Header */}
      <header className="px-4 py-4 shadow-sm relative z-50 bg-white md:px-6">
        {/* === Top Row === */}
        <div className="flex justify-between items-center md:py-2">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              className="text-2xl md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Logo: icon for mobile, full for desktop */}
            <img src={logo} alt="Logo" className="h-10 w-20 md:hidden" />
            <img src={logo} alt="Logo" className="h-10 w-20 hidden md:block" />
          </div>

          {/* Center Nav: Only desktop */}
          <nav className="hidden md:flex gap-6 items-center text-gray-700">
            <LocationSelector />
            <a href="/ecom">Ecom</a>
            <a href="/architectdashboard">Architect Dashboard</a>
            <a href="/vendordashboard">Vendor Dashboard</a>
            <a href="/lorem">Lorem Ipsum</a>
          </nav>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <input
                type="text"
                placeholder="Search"
                className="px-3 py-1 border rounded-lg text-sm"
              />
              <select className="text-sm border rounded-lg px-2 py-1">
                <option>Talent</option>
              </select>
            </div>

            {!isLoggedIn ? (
              <button
                className="bg-blue-500 text-black px-4 py-1 rounded-md text-sm font-semibold"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            ) : (
              <button
                className="bg-red-500 text-white px-4 py-1 rounded-md text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* === Location Bar – Mobile ONLY === */}
        <div className="mt-4 flex justify-between items-center text-sm md:hidden">
          <LocationSelector />
          {/* <a href="#" className="underline text-sm font-medium text-gray-800">
            Visit Our Store
          </a> */}
        </div>

        {/* === Mobile Menu (Dropdown) === */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-4 md:hidden z-30">
            <a href="/ecom">Ecom</a>
            <a href="/architectdashboard">Architect Dashboard</a>
            <a href="/vendordashboard">Vendor Dashboard</a>
            <a href="/lorem">Lorem Ipsum</a>

            <input
              type="text"
              placeholder="Search"
              className="px-3 py-2 border rounded-lg text-sm"
            />
            <select className="text-sm border rounded-lg px-2 py-2">
              <option>Talent</option>
            </select>

            {!isLoggedIn ? (
              <>
                <button className="text-sm" onClick={() => navigate("/login")}>
                  Log In
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                  onClick={() => navigate("/login")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      <CategoryBar />
      <HomeComponent />
      {/* footer */}

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 flex flex-col md:flex-row bg-[#0b1c38] text-white rounded-xl overflow-hidden mb-10">
        <div className="w-full">
          {/* Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm mb-2">For Clients</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <li key={j} className="hover:text-white cursor-pointer">
                      Lorem Ipsum
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social & App Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-600 pt-4 gap-4 font-montreal">
            {/* Social Icons */}
            <div className="flex items-center gap-2 text-xs">
              <span>Follow Us</span>
              <div className="flex gap-2 text-white">
                <IconWrapper icon={<FaFacebookF />} />
                <IconWrapper icon={<FaLinkedinIn />} />
                <IconWrapper icon={<FaTwitter />} />
                <IconWrapper icon={<FaInstagram />} />
                <IconWrapper icon={<FaYoutube />} />
              </div>
            </div>

            {/* Mobile Apps */}
            <div className="flex items-center gap-2 text-xs">
              <span>Mobile Apps</span>
              <IconWrapper icon={<FaApple />} />
              <IconWrapper icon={<FaAndroid />} />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 mt-4">
            <p className="text-center sm:text-left">
              © 2025{" "}
              <span className="font-semibold text-white">Lorem Ipsum</span> ®
              All Right Reserved.
            </p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <a href="/lorem" className="hover:text-white">
                Terms of Service
              </a>
              <a href="/lorem" className="hover:text-white">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function IconWrapper({ icon }) {
  return (
    <button className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 hover:bg-white hover:text-black transition">
      {icon}
    </button>
  );
}

export default Home;
