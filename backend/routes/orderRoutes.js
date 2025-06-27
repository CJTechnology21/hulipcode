
const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  markOrderPaid,
  markOrderDelivered,
  deleteOrder,
  getVendorOrders,
  updateOrderStatus,

  // getNewVendorOrders,
} = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');

// 🔒 Specific routes first
router.get('/vendor-orders', protect, getVendorOrders);
// router.get('/vendor-new', protect, getNewVendorOrders);

// 📦 General routes after specific ones
router.post('/', protect, createOrder);
router.get('/', protect, getAllOrders);
router.put('/:id/pay', protect, markOrderPaid);
router.put('/:id/deliver', protect, markOrderDelivered);
router.put('/:id/status', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);


// ⚠️ Keep this one LAST — it's the dynamic one
router.get('/:id', protect, getOrderById);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   markOrderPaid,
//   markOrderDelivered,
//   deleteOrder,
//   getVendorOrders,
//   updateOrderStatus,
//   getNewVendorOrders,
// } = require('../controllers/orderController');

// const { protect } = require('../middleware/authMiddleware');
// router.get("/vendor-orders", protect, getVendorOrders); // ✅ must be before ':id'
// router.post('/', protect, createOrder);
// router.get('/', protect, getAllOrders);
// router.get('/:id', protect, getOrderById);
// router.put('/:id/pay', protect, markOrderPaid);
// router.put('/:id/deliver', protect, markOrderDelivered);
// router.delete('/:id', protect, deleteOrder);
// router.put('/:id/status', protect, updateOrderStatus);
// router.get('/vendor-new', protect, getNewVendorOrders);

// module.exports = router;
