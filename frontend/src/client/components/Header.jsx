
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiFilter,
  FiTrendingUp,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Cart from "./Cart";
import logo from "../../Admin/images/logo.jpg";
import { toast } from "react-toastify";
import { setCart } from "../../app/features/cart/cartSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("crm_token");
      if (!token) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE}/api/cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(setCart(res.data || []));
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user_id");
    toast.success("Logout successful");
    navigate("/login");
  };

  return (
    <>
      <header className="w-full shadow-sm sticky top-0 bg-white z-50">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-6">
          <img src={logo} alt="Logo" className="h-12 w-36" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="/ecom">Home</a>
            <a href="/shop">Shop</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-5 text-xl relative">
            <FiUser
              className="cursor-pointer"
              onClick={() => navigate("/userprofile")}
            />
            <div
              onClick={() => {
                setLiked(true);
                setTimeout(() => navigate("/favourites"), 100);
              }}
            >
              {liked ? (
                <FaHeart className="text-red-500 text-xl cursor-pointer" />
              ) : (
                <FiHeart className="text-gray-500 text-xl cursor-pointer" />
              )}
            </div>
            <div
              className="relative cursor-pointer"
              onClick={() => setCartOpen(true)}
            >
              <FiShoppingCart />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalCount}
                </span>
              )}
            </div>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded-md text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-2xl"
          >
            <FiMenu />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col justify-between">
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Welcome !</h2>
              <FiX
                className="text-2xl cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            </div>
            <div className="space-y-4 text-base font-medium">
              <a href="/ecom" className="block">Home</a>
              <a href="/gallery" className="block">About</a>
              <a href="/categories" className="block">Products</a>
              <a href="/contact" className="block">Contact Us</a>

              <div className="flex items-center gap-6 pt-4 text-xl">
                <FiUser onClick={() => navigate("/userprofile")} />
                <FiHeart onClick={() => navigate("/favourites")} />
                <div
                  className="relative cursor-pointer"
                  onClick={() => setCartOpen(true)}
                >
                  <FiShoppingCart />
                  {totalCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {totalCount}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md text-sm w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex border-t w-full">
            <button
              className="w-1/2 py-3 flex justify-center items-center gap-2 text-sm font-medium border-r"
              onClick={() => {
                setSortOpen(true);
                setMenuOpen(false);
              }}
            >
              <FiTrendingUp /> SORT
            </button>
            <button
              className="w-1/2 py-3 flex justify-center items-center gap-2 text-sm font-medium"
              onClick={() => {
                setFilterOpen(true);
                setMenuOpen(false);
              }}
            >
              <FiFilter /> FILTER
            </button>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {sortOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center"
          onClick={() => setSortOpen(false)}
        >
          <div
            className="bg-white w-[90%] max-w-sm rounded-lg shadow-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sort By</h3>
              <FiX className="text-2xl cursor-pointer" onClick={() => setSortOpen(false)} />
            </div>
            <div className="space-y-2 text-sm">
              {["Popular", "Recommended", "Newest", "Price Low to High", "Price High to Low", "Discount"].map(item => (
                <div
                  key={item}
                  className={`p-3 rounded cursor-pointer ${item === "Popular" ? "bg-yellow-400 text-black font-medium" : "border"}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {filterOpen && (
        <div className="fixed inset-0 bg-white z-[999] flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Filters</h3>
            <FiX
              className="text-2xl cursor-pointer"
              onClick={() => setFilterOpen(false)}
            />
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-1/3 border-r overflow-y-auto text-sm font-medium space-y-2 px-4 py-3">
              {["Price", "Categories", "Series Name", "Color", "Finish", "Approx Size (ft)", "Approx Thickness (mm)", "Base Material", "Application"].map(cat => (
                <div key={cat} className="py-2 border-b">{cat}</div>
              ))}
            </div>

            <div className="w-2/3 p-4 overflow-y-auto text-sm space-y-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full border px-3 py-2 rounded"
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" className="toggle" />
                Show Samples
              </label>
              <label className="flex items-center justify-between border px-2 py-2 rounded">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <span>ft</span>
                </div>
                <span className="text-gray-500 text-xs">11083</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-t">
            <button className="text-red-500 font-medium" onClick={() => {/* Reset logic */}}>
              Reset
            </button>
            <button
              className="bg-yellow-400 px-6 py-2 rounded text-black font-medium"
              onClick={() => setFilterOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Header;