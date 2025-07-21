import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../app/features/cart/cartSlice";
import logo from "../Admin/images/logo.jpg";
import LocationSelector from "../Admin/components/Homecomponents/LocationSelector";
import { FaTimes, FaBars } from "react-icons/fa";
import CategoryBar from "../client/components/CategoryBar";
import { useAuth } from "../context/AuthContext"; // ✅ Make sure the path is correct

function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout, loading } = useAuth(); //  use user from context

  const handleLogout = async () => {
    await logout(); //  logout from context (calls server + clears state)
    dispatch(clearCart()); //  make sure to invoke the action
    navigate("/login");
  };

  return (
    <div>
      <div className="bg-white font-montreal">
        {/* Header */}
        <header className="px-4 py-4 shadow-sm relative z-50 bg-white md:px-6">
          {/* === Top Row === */}
          <div className="flex justify-between items-center md:py-2">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                className="text-2xl md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>

              {/* Logo */}
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

            {/* Right Actions */}
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

              {!user ? (
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm font-semibold"
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

              {!user ? (
                <>
                  <button
                    className="text-sm"
                    onClick={() => navigate("/login")}
                  >
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

        {/* Body Content */}
        <CategoryBar />
        {/* <HomeComponent /> */}
      </div>
    </div>
  );
}

export default HomeHeader;
