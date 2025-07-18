
const Cart = require('../models/Cart.js');

// Save or update entire user's cart
const saveCart = async (req, res) => {
  const userId = req.user._id;


  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid data: items must be an array" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    items.forEach((newItem) => {
      const existingItem = cart.items.find((i) => i._id.toString() === newItem._id);

      if (existingItem) {
        // ✅ Increment quantity
        existingItem.quantity += 1;
      } else {
        // ✅ Default quantity to 1
        cart.items.push({ ...newItem, quantity: 1 });
      }
    });

    await cart.save();
    res.status(200).json({ message: "Cart saved successfully", items: cart.items });
  } catch (error) {
    console.error("Save cart error:", error);
    res.status(500).json({ message: "Server error while saving cart" });
  }
};


// Get user's cart
const getCart = async (req, res) => {
  const userId = req.user._id;
       console.log("🔍 getCart | User ID:", req.user?._id);

  try {
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart?.items || []);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
};

// Clear user's cart


// Remove a single item from the cart
const removeItemFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item._id.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed", items: cart.items });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// ✅ NEW: Update quantity of single item
const updateItemQuantity = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i._id.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Quantity updated", item });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Failed to update item quantity" });
  }
};
// controllers/cartController.js
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};

module.exports = {
  saveCart,
  getCart,
  clearCart,
  removeItemFromCart,
  updateItemQuantity ,
  clearCart,
};

// const Cart = require('../models/Cart.js')
// module.exports = {
//   saveCart,
//   getCart,
//   clearCart,
//   removeItemFromCart,
//   updateItemQuantity,
// };

//   try {
//     const existingCart = await Cart.findOne({ userId });

//     if (existingCart) {
//       existingCart.items = items;
//       await existingCart.save();
//     } else {
//       await Cart.create({ userId, items });
//     }

//     res.status(200).json({ message: "Cart saved successfully" });
//   } catch (error) {
//     console.error("Save cart error:", error);
//     res.status(500).json({ message: "Server error while saving cart" });
//   }
// };
// // Get user's cart
//  const getCart = async (req, res) => {
//   const  userId  = req.user._id;

//   if (!userId) {
//     return res.status(400).json({ message: "User ID is required" });
//   }

//   try {
//     const cart = await Cart.findOne({ userId });
//     res.status(200).json(cart?.items || []);
//   } catch (error) {
//     console.error("Get cart error:", error);
//     res.status(500).json({ message: "Server error while fetching cart" });
//   }
// };

// // Clear user's cart
//  const clearCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     await Cart.deleteOne({ userId });
//     res.status(200).json({ message: "Cart cleared" });
//   } catch (err) {
//     console.error("Clear cart error:", err);
//     res.status(500).json({ message: "Failed to clear cart" });
//   }
// };
// // Remove a single item from the user's cart
// const removeItemFromCart = async (req, res) => {
//   const userId = req.user._id;
//   const { productId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Filter out the item to be removed
//     cart.items = cart.items.filter(item => item._id.toString() !== productId);
//     await cart.save();

//     res.status(200).json({ message: "Item removed from cart", items: cart.items });
//   } catch (err) {
//     console.error("Remove cart item error:", err);
//     res.status(500).json({ message: "Failed to remove item from cart" });
//   }
// };

// module.exports={saveCart,clearCart,getCart,removeItemFromCart}