
  // src/app/features/cart/cartSlice.js
  import { createSlice } from "@reduxjs/toolkit";
  import { toast } from "react-toastify";

  const initialState = {
    items: [],
  };

  const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      // ✅ Set cart from API
      setCart(state, action) {
        if (!Array.isArray(action.payload)) {
          console.warn("❌ setCart payload not an array:", action.payload);
          return;
        }

        state.items = action.payload.map((item) => ({
          ...item,
          _id: item._id?.toString?.(), // Make sure it's a string
        }));

        // console.log("✅ Redux state updated via setCart:", state.items);
      },

      addToCart(state, action) {
        const product = action.payload;
        if (!product || !product._id) {
          toast.error("Invalid product data");
          return;
        }

        const existing = state.items.find(
          (item) => item._id === product._id.toString()
        );

        if (existing) {
          existing.quantity += 1;
          toast.info(`${existing.name} quantity increased`);
        } else {
          state.items.push({ ...product, quantity: 1 });
          toast.success(`${product.name} added to cart`);
        }
      },

      incrementQuantity(state, action) {
        const item = state.items.find((i) => i._id === action.payload);
        if (item) {
          item.quantity += 1;
          toast.info(`${item.name} quantity incremented`);
        }
      },

      decrementQuantity(state, action) {
        const item = state.items.find((i) => i._id === action.payload);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
          toast.info(`${item.name} quantity decremented`);
        } else if (item) {
          state.items = state.items.filter((i) => i._id !== action.payload);
          toast.warn(`${item.name} removed from cart`);
        }
      },

      removeFromCart(state, action) {
        const item = state.items.find((i) => i._id === action.payload);
        state.items = state.items.filter((i) => i._id !== action.payload);
        toast.error(`${item?.name || "Item"} removed from cart`);
      },

      clearCart(state) {
        state.items = [];
      },
    },
  });

  export const {
    setCart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = cartSlice.actions;

  export default cartSlice.reducer;
