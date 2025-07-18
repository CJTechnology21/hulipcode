
const express = require("express");
const router = express.Router();
const { saveCart, getCart, clearCart,removeItemFromCart, updateItemQuantity } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");


// Use middleware to protect routes
router.post("/", protect, saveCart);        
router.get("/", protect, getCart);          
router.delete("/clear", protect, clearCart); 
router.delete("/:productId", protect, removeItemFromCart);
router.put('/:productId', protect, updateItemQuantity)


module.exports = router;
