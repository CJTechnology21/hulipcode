import { useEffect, useState } from "react";
import { FiMenu, FiX, FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
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

  const cartItems = useSelector((state) => state.cart.items) || [];
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ✅ Fetch cart from backend on load
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("crm_token");
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const backendCart = res.data || []; // Expecting just an array
        dispatch(setCart(backendCart));
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

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="/ecom">Home</a>
            <a href="/shop">Shop</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-5 text-xl relative">
            <FiUser
              className="cursor-pointer"
              onClick={() => navigate("/userprofile")}
            />
            <div
              onClick={() => {
                setLiked(true); // Set filled first
                setTimeout(() => navigate("/favourites"), 100); // Navigate after state updates
              }}
            >
              {liked ? (
                <FaHeart className="text-red-500 text-xl cursor-pointer" />
              ) : (
                <FiHeart className="text-gray-500 text-xl cursor-pointer" />
              )}
            </div>

            {/* <FiHeart className="cursor-pointer" onClick={() => navigate("/favourites")} /> */}

            {/* Cart Icon with Count */}
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

          {/* Hamburger Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-2 text-sm">
            <a href="/ecom" className="block">
              Home
            </a>
            <a href="/shop" className="block">
              Shop
            </a>
            <a href="/about" className="block">
              About
            </a>
            <a href="/contact" className="block">
              Contact
            </a>
            <div className="flex gap-4 pt-2 text-xl relative">
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
          </div>
        )}
      </header>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Header;
