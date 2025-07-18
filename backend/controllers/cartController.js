const mongoose = require('mongoose');
const Cart = require('../models/Cart.js');

// Save or update user's cart
const saveCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    console.log("🔄 Saving cart for user:", userId);
    console.log("🛒 Incoming items:", items);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    for (const newItem of items) {
      try {
        const { _id, vendor, name, image, price, quantity } = newItem;

        if (
          !_id ||
          !mongoose.isValidObjectId(_id) ||
          !vendor ||
          !mongoose.isValidObjectId(vendor)
        ) {
          console.warn("❌ Skipping invalid item:", newItem);
          continue;
        }

        const existingItem = cart.items.find(
          (item) => item.productId.toString() === _id.toString()
        );

        if (existingItem) {
          existingItem.quantity += quantity || 1;
        } else {
          cart.items.push({
            productId: _id, // let Mongoose auto-cast
            name,
            image,
            price,
            quantity: quantity || 1,
            vendor, // let Mongoose auto-cast
          });
        }
      } catch (itemError) {
        console.error("❌ Error processing item:", newItem, itemError);
      }
    }

    await cart.save();
    res.status(200).json({ message: "✅ Cart saved successfully", cart });

  } catch (error) {
    console.error("❌ Save cart error:", error);
    res.status(500).json({ message: "Server error while saving cart" });
  }
};
// Get user's cart
const getCart = async (req, res) => {
  const userId = req.user?._id || req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID missing in request' });
  }

  console.log("🔍 Fetching cart for user:", userId);

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json({ items: cart.items });
    console.log(cart.items)
  } catch (error) {
    console.error('❌ Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
};

// Remove a single item from the cart
const removeItemFromCart = async (req, res) => {
  const userId = req.user?._id || req.body.userId;
  const { productId } = req.params;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'User ID or Product ID missing' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => {
      try {
        return item.productId?.toString?.() !== productId;
      } catch (e) {
        console.warn('⚠️ Skipping item with invalid productId during removal:', item);
        return true;
      }
    });

    await cart.save();
    res.status(200).json({ message: '🗑️ Item removed', items: cart.items });
  } catch (err) {
    console.error('❌ Remove cart item error:', err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
};

// Update quantity of a single item
const updateItemQuantity = async (req, res) => {
  const userId = req.user?._id || req.body.userId;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!userId || !productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.productId?.toString?.() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: '✅ Quantity updated', item });
  } catch (err) {
    console.error('❌ Update quantity error:', err);
    res.status(500).json({ message: 'Failed to update item quantity' });
  }
};

// Clear user's cart
const clearCart = async (req, res) => {
  const userId = req.user?._id || req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID missing in request' });
  }

  try {
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: '🧹 Cart cleared' });
  } catch (error) {
    console.error('❌ Clear Cart Error:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};

module.exports = {
  saveCart,
  getCart,
  clearCart,
  removeItemFromCart,
  updateItemQuantity,
};
