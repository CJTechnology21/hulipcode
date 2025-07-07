const mongoose = require('mongoose');
const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const webpush = require('../utils/webPush');
const User = require('../models/User')
const VendorToken = require('../models/VendorToken'); // adjust path if needed


// ✅ CREATE ORDER (with push notifications)

const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      rewardPointsUsed = 0,
    } = req.body;

    if (!items || items.length === 0) {
      console.warn("⚠️ No order items provided");
      return res.status(400).json({ message: "No order items provided" });
    }

    // Normalize vendor IDs
    items.forEach((item) => {
      if (typeof item.vendor === "string") {
        item.vendor = new mongoose.Types.ObjectId(item.vendor);
      }
    });

    // Fetch user
    const user = await User.findById(req.user._id);
    if (!user) {
      console.error("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the subtotal from backend
    const computedSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let finalAmount = computedSubtotal;

    // Deduct reward points if applicable
    if (user.role === "architect" && rewardPointsUsed > 0) {
      if (user.rewardPoints < rewardPointsUsed) {
        return res.status(400).json({ message: "Insufficient reward points" });
      }
      user.rewardPoints -= rewardPointsUsed;
      finalAmount = Math.max(0, computedSubtotal - rewardPointsUsed);
    } else if (user.role !== "architect" && rewardPointsUsed > 0) {
      return res.status(400).json({ message: "Reward points not allowed for this user role" });
    }

    // Save order
    const newOrder = new Order({
      buyer: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      rewardPointsUsed: user.role === "architect" ? rewardPointsUsed : 0,
      totalAmount: finalAmount,
    });

    let savedOrder = await newOrder.save();
    savedOrder = await savedOrder.populate("buyer", "name email");

    // ✅ Grant reward points after order (Example: ₹100 = 1 point)
    const pointsEarned = Math.floor(finalAmount / 100);
    if (user.role === 'architect' && pointsEarned > 0) {
      user.rewardPoints += pointsEarned;
      await user.save();
      console.log(`✅ Granted ${pointsEarned} reward points to ${user.name}`);
    }

    // Vendor notification
    const vendorIds = [...new Set(items.map(item => item.vendor?.toString()))];
    const tokens = await VendorToken.find({ vendorId: { $in: vendorIds } });

    for (const vendorId of vendorIds) {
      const vendorUser = await User.findById(vendorId).select("name");
      const vendorName = vendorUser?.name || "Vendor";

      const vendorItems = items.filter(
        item => item.vendor && item.vendor.toString() === vendorId
      );

      const orderValue = vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const vendorTokens = tokens.filter(
        t => t.vendorId.toString() === vendorId && !!t.token
      );

      for (const tokenDoc of vendorTokens) {
        try {
          await sendFCM(
            tokenDoc.token,
            `🛒 New Order from ${req.user.name}`,
            `Order value ₹${orderValue}`,
            savedOrder._id
          );
        } catch (err) {
          console.error(`❌ FCM failed for vendor ${vendorId}:`, err.message);
        }
      }
    }

    // Final response
    res.status(201).json({
      message: "Order created",
      order: savedOrder,
      rewardPoints: user.rewardPoints,
      pointsEarned,
    });

  } catch (error) {
    console.error("Create Order Error:", error.stack || error.message);
    res.status(500).json({ message: "Failed to create order" });
  }
};

module.exports = { createOrder };

// const createOrder = async (req, res) => {
//   try {
   

//     const {
//       items,
//       shippingAddress,
//       paymentMethod,
//       rewardPointsUsed = 0,
//     } = req.body;

//     if (!items || items.length === 0) {
//       console.warn("⚠️ No order items provided");
//       return res.status(400).json({ message: "No order items provided" });
//     }

//     // Normalize vendor IDs
   
//     items.forEach((item, index) => {
//       if (typeof item.vendor === "string") {
       
//         item.vendor = new mongoose.Types.ObjectId(item.vendor);
//       }
//     });

//     // Fetch user
    
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       console.error("❌ User not found");
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Calculate the subtotal (actual price from backend, not from frontend)
//     const computedSubtotal = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     let finalAmount = computedSubtotal;

//     // Apply reward points only for architects
//     if (user.role === "architect" && rewardPointsUsed > 0) {
    
//       if (user.rewardPoints < rewardPointsUsed) {
       
//         return res.status(400).json({ message: "Insufficient reward points" });
//       }

//       // Deduct points and update final amount
//       user.rewardPoints -= rewardPointsUsed;
//       await user.save();
//       finalAmount = Math.max(0, computedSubtotal - rewardPointsUsed);

//     } else if (user.role !== "architect" && rewardPointsUsed > 0) {
//       // console.warn(" Reward points not allowed for this role");
//       return res.status(400).json({ message: "Reward points not allowed for this user role" });
//     }

//     // Save order
//     const newOrder = new Order({
//       buyer: req.user._id,
//       items,
//       shippingAddress,
//       paymentMethod,
//       rewardPointsUsed: user.role === "architect" ? rewardPointsUsed : 0,
//       totalAmount: finalAmount,
//     });

//     let savedOrder = await newOrder.save();
   

//     savedOrder = await savedOrder.populate("buyer", "name email");
    

//     // Vendor notification
//     const vendorIds = [...new Set(items.map(item => item.vendor?.toString()))];
    

//     const tokens = await VendorToken.find({ vendorId: { $in: vendorIds } });
    

//     for (const vendorId of vendorIds) {
//       const vendorUser = await User.findById(vendorId).select("name");
//       const vendorName = vendorUser?.name || "Vendor";

//       const vendorItems = items.filter(
//         item => item.vendor && item.vendor.toString() === vendorId
//       );

//       const orderValue = vendorItems.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );

//       const vendorTokens = tokens.filter(
//         t => t.vendorId.toString() === vendorId && !!t.token
//       );

     

//       for (const tokenDoc of vendorTokens) {
//         try {
//           await sendFCM(
//             tokenDoc.token,
//             `🛒 New Order from ${req.user.name}`,
//             `Order value ₹${orderValue}`,
//             savedOrder._id
//           );
//         } catch (err) {
//           console.error(`❌ FCM failed for vendor ${vendorId}:`, err.message);
//         }
//       }
//     }

    
//     res.status(201).json({ message: "Order created", order: savedOrder });

//   } catch (error) {
//     console.error("Create Order Error:", error.stack || error.message);
//     res.status(500).json({ message: "Failed to create order" });
//   }
// };
// const createOrder = async (req, res) => {
//   try {
//     console.log("➡️ Incoming order request body:", req.body);

//     const {
//       items,
//       shippingAddress,
//       paymentMethod,
//       rewardPointsUsed = 0,
//     } = req.body;

//     if (!items || items.length === 0) {
//       console.warn("⚠️ No order items provided");
//       return res.status(400).json({ message: "No order items provided" });
//     }

//     // Normalize vendor IDs
//     console.log("🔄 Normalizing vendor IDs");
//     items.forEach((item, index) => {
//       if (typeof item.vendor === "string") {
//         console.log(`🔧 Converting vendor ID to ObjectId for item ${index}`);
//         item.vendor = new mongoose.Types.ObjectId(item.vendor);
//       }
//     });

//     // Fetch user
//     console.log("👤 Fetching user:", req.user._id);
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       console.error("❌ User not found");
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Calculate the subtotal (actual price from backend, not from frontend)
//     const computedSubtotal = items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     let finalAmount = computedSubtotal;

//     // Apply reward points only for architects
//     if (user.role === "architect" && rewardPointsUsed > 0) {
//       console.log(`🎁 Architect applying ${rewardPointsUsed} reward points`);

//       if (user.rewardPoints < rewardPointsUsed) {
//         console.warn("⚠️ Insufficient reward points");
//         return res.status(400).json({ message: "Insufficient reward points" });
//       }

//       // Deduct points and update final amount
//       user.rewardPoints -= rewardPointsUsed;
//       await user.save();
//       finalAmount = Math.max(0, computedSubtotal - rewardPointsUsed);
//       console.log(`✅ Reward points applied. Final total: ₹${finalAmount}`);
//     } else if (user.role !== "architect" && rewardPointsUsed > 0) {
//       console.warn("⛔ Reward points not allowed for this role");
//       return res.status(400).json({ message: "Reward points not allowed for this user role" });
//     }

//     // Save order
//     console.log("💾 Creating order document");
//     const newOrder = new Order({
//       buyer: req.user._id,
//       items,
//       shippingAddress,
//       paymentMethod,
//       rewardPointsUsed: user.role === "architect" ? rewardPointsUsed : 0,
//       totalAmount: finalAmount,
//     });

//     let savedOrder = await newOrder.save();
//     console.log("📦 Order saved with ID:", savedOrder._id);

//     savedOrder = await savedOrder.populate("buyer", "name email");
//     console.log("👤 Buyer populated:", savedOrder.buyer);

//     // Vendor notification
//     const vendorIds = [...new Set(items.map(item => item.vendor?.toString()))];
//     console.log("📢 Notifying vendors:", vendorIds);

//     const tokens = await VendorToken.find({ vendorId: { $in: vendorIds } });
//     console.log(`📲 Found ${tokens.length} vendor FCM tokens`);

//     for (const vendorId of vendorIds) {
//       const vendorUser = await User.findById(vendorId).select("name");
//       const vendorName = vendorUser?.name || "Vendor";

//       const vendorItems = items.filter(
//         item => item.vendor && item.vendor.toString() === vendorId
//       );

//       const orderValue = vendorItems.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );

//       const vendorTokens = tokens.filter(
//         t => t.vendorId.toString() === vendorId && !!t.token
//       );

//       console.log(`📨 Sending FCM to vendor ${vendorName} (${vendorId}) for ₹${orderValue}`);

//       for (const tokenDoc of vendorTokens) {
//         try {
//           await sendFCM(
//             tokenDoc.token,
//             `🛒 New Order from ${req.user.name}`,
//             `Order value ₹${orderValue}`,
//             savedOrder._id
//           );
//         } catch (err) {
//           console.error(`❌ FCM failed for vendor ${vendorId}:`, err.message);
//         }
//       }
//     }

//     console.log("✅ Order processing complete");
//     res.status(201).json({ message: "Order created", order: savedOrder });

//   } catch (error) {
//     console.error("🔥 Create Order Error:", error.stack || error.message);
//     res.status(500).json({ message: "Failed to create order" });
//   }
// };



// ✅ GET ALL ORDERS (vendor sees only their own)
const getAllOrders = async (req, res) => {
  try {
    const query = req.user.role === 'vendor'
      ? { 'items.vendor': req.user._id }
      : {};

    const orders = await Order.find(query)
      .populate('buyer', 'name email')
      .populate('items.product', 'name')
      .populate('items.vendor', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// ✅ GET SINGLE ORDER BY ID (auth check)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('items.product', 'name')
      .populate('items.vendor', 'name');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isBuyer = order.buyer._id.equals(req.user._id);
    const isVendor = order.items.some(item => item.vendor.equals(req.user._id));
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isVendor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// ✅ MARK ORDER AS PAID
const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json({ message: 'Order marked as paid', order: updatedOrder });
  } catch (error) {
    console.error('Mark Paid Error:', error);
    res.status(500).json({ message: 'Failed to mark order as paid' });
  }
};

// ✅ MARK ORDER AS DELIVERED
const markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json({ message: 'Order marked as delivered', order: updatedOrder });
  } catch (error) {
    console.error('Mark Delivered Error:', error);
    res.status(500).json({ message: 'Failed to mark order as delivered' });
  }
};

// ✅ DELETE ORDER (buyer or admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.buyer.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this order' });
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};

// ✅ GET VENDOR'S OWN ORDERS
const getVendorOrders = async (req, res) => {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orders = await Order.find({
      items: { $elemMatch: { vendor: req.user._id } }
    }).populate('buyer', 'name');

    res.json({ orders, role: req.user.role });
  } catch (error) {
    console.error('Vendor Order Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ✅ UPDATE ORDER STATUS (vendor or admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};




module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  markOrderPaid,
  markOrderDelivered,
  deleteOrder,
  getVendorOrders,
  updateOrderStatus,

};

// const Order = require('../models/order');
// const mongoose = require('mongoose')
// const Subscription = require('../models/Subscription');
// const webpush = require('../utils/webPush');
// // // ✅ CREATE ORDER
// const createOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//     } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: 'No order items provided' });
//     }

//     // Create new order
//     const newOrder = new Order({
//       buyer: req.user._id,
//       items,
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//     });

//     // Save order to DB
//     let savedOrder = await newOrder.save();
//     savedOrder = await savedOrder.populate('buyer', 'name email');

//     // ✅ Extract unique vendor IDs from order items
//     const vendorIds = [...new Set(items.map(item => item.vendor.toString()))];

//     // ✅ Fetch subscriptions of the vendors
//     const subscriptions = await Subscription.find({ vendorId: { $in: vendorIds } });

//     // ✅ Send notifications to each subscribed vendor
//     const notificationPayload = JSON.stringify({
//       title: '📦 New Order Received',
//       body: 'You have a new order. View it in your vendor dashboard.',
//       icon: '/logo.png', // optional: path to your logo or icon
//       url: '/vendor/orders' // frontend route
//     });
// await Promise.all(subscriptions.map(async (sub) => {
//   try {
//     await webpush.sendNotification(sub.subscription, notificationPayload);
//   } catch (err) {
//     console.error(`❌ Push notification failed for vendor ${sub.vendorId}:`, err);
//   }
// }));

//     // for (const sub of subscriptions) {
//     //   try {
//     //     await webpush.sendNotification(sub.subscription, notificationPayload);
//     //   } catch (err) {
//     //     console.error(`❌ Push notification failed for vendor ${sub.vendorId}:`, err);
//     //   }
//     // }

//     res.status(201).json({ message: 'Order created', order: savedOrder });

//   } catch (error) {
//     console.error('Create Order Error:', error);
//     res.status(500).json({ message: 'Failed to create order' });
//   }
// };

// // const createOrder = async (req, res) => {
// //   try {
// //     const {
// //       items,
// //       shippingAddress,
// //       paymentMethod,
// //       totalAmount,
// //     } = req.body;

// //     if (!items || items.length === 0) {
// //       return res.status(400).json({ message: 'No order items provided' });
// //     }

// //     const newOrder = new Order({
// //       buyer: req.user._id,
// //       items,
// //       shippingAddress,
// //       paymentMethod,
// //       totalAmount,
// //     });

// //     let savedOrder = await newOrder.save();
// //     savedOrder = await savedOrder.populate('buyer','name email')
// //     res.status(201).json({ message: 'Order created', order: savedOrder });
// //   } catch (error) {
// //     console.error('Create Order Error:', error);
// //     res.status(500).json({ message: 'Failed to create order' });
// //   }
// // };

// // ✅ GET ALL ORDERS (VENDOR sees only their orders)
// const getAllOrders = async (req, res) => {
//   try {
//     let query = {};

//     if (req.user.role === 'vendor') {
//       query['items.vendor'] = req.user._id;
//     }

//     const orders = await Order.find(query)
//       .populate('buyer', 'name email') // ✅ populate buyer info
//       .populate('items.product', 'name') // optional: product name
//       .populate('items.vendor', 'name') // optional: vendor name
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     console.error('Get Orders Error:', error);
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// };

// // ✅ GET ORDER BY ID
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('buyer', 'name email')
//       .populate('items.product', 'name')
//       .populate('items.vendor', 'name');

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const isBuyer = order.buyer._id.equals(req.user._id);
//     const isVendor = order.items.some(item => item.vendor.equals(req.user._id));
//     const isAdmin = req.user.role === 'admin';

//     if (!isBuyer && !isVendor && !isAdmin) {
//       return res.status(403).json({ message: 'Not authorized to view this order' });
//     }

//     res.json(order);
//   } catch (error) {
//     console.error('Get Order Error:', error);
//     res.status(500).json({ message: 'Failed to fetch order' });
//   }
// };

// // ✅ MARK AS PAID
// const markOrderPaid = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     order.isPaid = true;
//     order.paidAt = Date.now();

//     const updatedOrder = await order.save();
//     res.json({ message: 'Order marked as paid', order: updatedOrder });
//   } catch (error) {
//     console.error('Mark Paid Error:', error);
//     res.status(500).json({ message: 'Failed to mark order as paid' });
//   }
// };

// // ✅ MARK AS DELIVERED
// const markOrderDelivered = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     order.isDelivered = true;
//     order.deliveredAt = Date.now();

//     const updatedOrder = await order.save();
//     res.json({ message: 'Order marked as delivered', order: updatedOrder });
//   } catch (error) {
//     console.error('Mark Delivered Error:', error);
//     res.status(500).json({ message: 'Failed to mark order as delivered' });
//   }
// };

// // ✅ DELETE ORDER
// const deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     const isOwner = order.buyer.equals(req.user._id);
//     const isAdmin = req.user.role === 'admin';

//     if (!isOwner && !isAdmin) {
//       return res.status(403).json({ message: 'Not authorized to delete this order' });
//     }

//     await order.deleteOne();
//     res.json({ message: 'Order deleted' });
//   } catch (error) {
//     console.error('Delete Order Error:', error);
//     res.status(500).json({ message: 'Failed to delete order' });
//   }
// };
// // GET orders for a specific vendor
// const getVendorOrders = async (req, res) => {
//   try {
//     if (req.user.role !== "vendor") {
//       return res.status(403).json({ message: "Not authorized", role: req.user.role });
//     }

//     const allOrders = await Order.find({
//       items: { $elemMatch: { vendor: req.user._id } }
//     }).populate("buyer", "name");

//     res.json({ orders: allOrders, role: req.user.role });
//   } catch (error) {
//     console.error("Vendor Order Fetch Error:", error);
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// };

// // ✅ UPDATE ORDER STATUS
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (!order) return res.status(404).json({ message: "Order not found" });

  
//     if (req.user.role !== "vendor" && req.user.role !== "admin") {
//       return res.status(403).json({ message: "Not authorized to update order status" });
//     }

//     order.status = status;
//     const updatedOrder = await order.save();
//     res.json({ message: "Order status updated", order: updatedOrder });
//   } catch (error) {
//     console.error("Update Status Error:", error);
//     res.status(500).json({ message: "Failed to update order status" });
//   }
// };
// // ✅ GET NEW ORDERS FOR VENDOR AFTER TIMESTAMP


// // const getNewVendorOrders = async (req, res) => {
// //   try {
// //     if (req.user.role !== "vendor") {
// //       return res.status(403).json({ message: "Not authorized" });
// //     }

// //     const { after } = req.query;

// //     if (!after) {
// //       return res.status(400).json({ message: "Missing 'after' timestamp in query" });
// //     }

// //     // 🔍 Debug and validate vendor ID
// //     const vendorId = req.user._id;
// //     console.log("Vendor ID received:", vendorId);

// //     if (!mongoose.Types.ObjectId.isValid(vendorId)) {
// //       return res.status(400).json({ message: "Invalid vendor ID format" });
// //     }

// //     // ✅ Query safely using vendor ID in nested array
// //     const newOrders = await Order.find({
// //       createdAt: { $gt: new Date(after) },
// //       items: { $elemMatch: { vendor: vendorId } },
// //     })
// //       .populate("buyer", "name email")
// //       .populate("items.product", "name")
// //       .populate("items.vendor", "name")
// //       .sort({ createdAt: -1 });

// //     res.json({ newOrders });
// //   } catch (error) {
// //     console.error("New Vendor Order Fetch Error:", error);
// //     res.status(500).json({ message: "Error fetching new vendor orders" });
// //   }
// // };

// module.exports = {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   markOrderPaid,
//   markOrderDelivered,
//   deleteOrder,
//   getVendorOrders,
//   updateOrderStatus,
//   // getNewVendorOrders
// };
