const VendorOrder = require("../models/VendorOrder");
const mongoose = require("mongoose");

// ==============================
// Create Vendor Order
// ==============================
const createVendorOrder = async (req, res) => {
  try {
    const { project, orderedBy, vendor, amount, architect } = req.body;

    if (!project || !orderedBy || !vendor || !amount || !architect) {
      return res.status(400).json({
        message:
          "project, orderedBy, vendor, architect, and amount are required",
      });
    }

    const order = await VendorOrder.create(req.body);

    res.status(201).json({ order });
  } catch (err) {
    console.error("Create VendorOrder Error:", err);
    res.status(500).json({ message: "Server error while creating VendorOrder" });
  }
};

// ==============================
// Get All Vendor Orders (with optional project filter)
// ==============================
const getVendorOrders = async (req, res) => {
  try {
    const { projectId } = req.query;

    let filter = {};
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
      }
      filter.project = projectId;
    }

    const orders = await VendorOrder.find(filter)
      .populate("project", "name location")
      .populate("orderedBy", "name email role")
      .populate("vendor", "name email phoneNumber role")
      .populate("architect", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get VendorOrders Error:", err);
    res.status(500).json({ message: "Server error while fetching VendorOrders" });
  }
};

// ==============================
// Get Vendor Orders by Architect
// ==============================
const getVendorOrdersByArchitect = async (req, res) => {
  try {
    const { architectId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(architectId)) {
      return res.status(400).json({ message: "Invalid architectId" });
    }

    const orders = await VendorOrder.find({ architect: architectId })
      .populate("project", "name location")
      .populate("orderedBy", "name email role")
      .populate("vendor", "name email phoneNumber role")
      .populate("architect", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get VendorOrdersByArchitect Error:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching VendorOrders" });
  }
};

// ==============================
// Get Single Vendor Order by ID
// ==============================
const getVendorOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await VendorOrder.findById(id)
      .populate("project", "name location")
      .populate("orderedBy", "name email role")
      .populate("vendor", "name email phoneNumber role")
      .populate("architect", "name email role");

    if (!order) return res.status(404).json({ message: "VendorOrder not found" });

    res.status(200).json({ order });
  } catch (err) {
    console.error("Get VendorOrder Error:", err);
    res.status(500).json({ message: "Server error while fetching VendorOrder" });
  }
};

// ==============================
// Update Vendor Order (full update)
// ==============================
const updateVendorOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await VendorOrder.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) return res.status(404).json({ message: "VendorOrder not found" });

    res.status(200).json({ order });
  } catch (err) {
    console.error("Update VendorOrder Error:", err);
    res.status(500).json({ message: "Server error while updating VendorOrder" });
  }
};

// ==============================
// Patch Vendor Order (partial update)
// ==============================
const patchVendorOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await VendorOrder.findByIdAndUpdate(
      id,
      { $set: req.body }, // only update passed fields
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ message: "VendorOrder not found" });

    res.status(200).json({ order });
  } catch (err) {
    console.error("Patch VendorOrder Error:", err);
    res.status(500).json({ message: "Server error while patching VendorOrder" });
  }
};

// ==============================
// Delete Vendor Order
// ==============================
const deleteVendorOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await VendorOrder.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "VendorOrder not found" });

    res.status(200).json({ message: "VendorOrder deleted successfully" });
  } catch (err) {
    console.error("Delete VendorOrder Error:", err);
    res.status(500).json({ message: "Server error while deleting VendorOrder" });
  }
};

module.exports = {
  createVendorOrder,
  getVendorOrders,
  getVendorOrdersByArchitect, 
  getVendorOrderById,
  updateVendorOrder,
  patchVendorOrder,
  deleteVendorOrder,
};

// const VendorOrder = require("../models/VendorOrder");
// const mongoose = require("mongoose");

// // ==============================
// // Create Vendor Order
// // ==============================
// const createVendorOrder = async (req, res) => {
//   try {
//     const { project, orderedBy, vendor, items, amount } = req.body;

//     if (!project || !orderedBy || !vendor || !amount) {
//       return res.status(400).json({
//         message: "project, orderedBy, vendor, and amount are required",
//       });
//     }

//     const order = await VendorOrder.create(req.body);

//     res.status(201).json({ order });
//   } catch (err) {
//     console.error("Create VendorOrder Error:", err);
//     res.status(500).json({ message: "Server error while creating VendorOrder" });
//   }
// };

// // ==============================
// // Get All Vendor Orders (with optional project filter)
// // ==============================
// const getVendorOrders = async (req, res) => {
//   try {
//     const { projectId } = req.query;

//     let filter = {};
//     if (projectId) {
//       if (!mongoose.Types.ObjectId.isValid(projectId)) {
//         return res.status(400).json({ message: "Invalid projectId" });
//       }
//       filter.project = projectId;
//     }

//     const orders = await VendorOrder.find(filter)
//       .populate("project", "name location")
//       .populate("orderedBy", "name email role")
//       .populate("vendor", "name email phoneNumber role")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ orders });
//   } catch (err) {
//     console.error("Get VendorOrders Error:", err);
//     res.status(500).json({ message: "Server error while fetching VendorOrders" });
//   }
// };

// // ==============================
// // Get Single Vendor Order by ID
// // ==============================
// const getVendorOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await VendorOrder.findById(id)
//       .populate("project", "name location")
//       .populate("orderedBy", "name email role")
//       .populate("vendor", "name email phoneNumber role");

//     if (!order) return res.status(404).json({ message: "VendorOrder not found" });

//     res.status(200).json({ order });
//   } catch (err) {
//     console.error("Get VendorOrder Error:", err);
//     res.status(500).json({ message: "Server error while fetching VendorOrder" });
//   }
// };

// // ==============================
// // Update Vendor Order (full update)
// // ==============================
// const updateVendorOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await VendorOrder.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!order) return res.status(404).json({ message: "VendorOrder not found" });

//     res.status(200).json({ order });
//   } catch (err) {
//     console.error("Update VendorOrder Error:", err);
//     res.status(500).json({ message: "Server error while updating VendorOrder" });
//   }
// };

// // ==============================
// // Patch Vendor Order (partial update)
// // ==============================
// const patchVendorOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await VendorOrder.findByIdAndUpdate(
//       id,
//       { $set: req.body }, // only update passed fields
//       { new: true, runValidators: true }
//     );

//     if (!order) return res.status(404).json({ message: "VendorOrder not found" });

//     res.status(200).json({ order });
//   } catch (err) {
//     console.error("Patch VendorOrder Error:", err);
//     res.status(500).json({ message: "Server error while patching VendorOrder" });
//   }
// };

// // ==============================
// // Delete Vendor Order
// // ==============================
// const deleteVendorOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await VendorOrder.findByIdAndDelete(id);
//     if (!order) return res.status(404).json({ message: "VendorOrder not found" });

//     res.status(200).json({ message: "VendorOrder deleted successfully" });
//   } catch (err) {
//     console.error("Delete VendorOrder Error:", err);
//     res.status(500).json({ message: "Server error while deleting VendorOrder" });
//   }
// };

// module.exports = {
//   createVendorOrder,
//   getVendorOrders,
//   getVendorOrderById,
//   updateVendorOrder,
//   patchVendorOrder,
//   deleteVendorOrder,
// };
