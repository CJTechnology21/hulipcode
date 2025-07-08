import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const CartSync = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const token = localStorage.getItem("crm_token");

  useEffect(() => {
    if (!token || cartItems.length === 0) return;

    const syncCart = async () => {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_BASE}/api/cart`,
          { items: cartItems },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Cart synced");
      } catch (err) {
        console.error("Failed to sync cart", err);
      }
    };

    syncCart();
  }, [cartItems, token]);

  return null;
};

export default CartSync;
