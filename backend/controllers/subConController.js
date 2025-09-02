const mongoose = require("mongoose");
const SubconOrder = require("../models/SubCon");


// Create Subcon Order
const createSubconOrder = async (req, res) => {
  try {
    let { projectId, todo, task, staff, architectId, amount, ...rest } = req.body;

    // Normalize empty strings to null
    todo = todo || null;
    task = task || null;

    // Required fields except todo/task
    if (!projectId || !staff || !architectId || !amount) {
      return res.status(400).json({
        message: "projectId, staff, architectId, and amount are required",
      });
    }

    // At least one of todo or task must be provided
    if (!todo && !task) {
      return res.status(400).json({
        message: "Either todo or task must be provided",
      });
    }

    console.log("Creating Sub-Con payload:", { projectId, todo, task, staff, architectId, amount, ...rest });

    const subcon = await SubconOrder.create({
      projectId,
      todo,
      task,
      staff,
      architectId,
      amount,
      ...rest,
    });

    res.status(201).json({ subcon });
  } catch (err) {
    console.error("Create Subcon Error:", err);
    res.status(500).json({ message: "Server error while creating subcon order" });
  }
};
// const createSubconOrder = async (req, res) => {
//   try {
//     const { projectId, todo, task, staff, architectId, amount, ...rest } = req.body;

//     // Required fields except todo/task
//     if (!projectId || !staff || !architectId || !amount) {
//       return res.status(400).json({
//         message: "projectId, staff, architectId, and amount are required",
//       });
//     }

//     // At least one of todo or task must be provided
//     if (!todo && !task) {
//       return res.status(400).json({
//         message: "Either todo or task must be provided",
//       });
//     }

//     // Log payload for debugging
//     console.log("Submitting payload:", { projectId, todo, task, staff, architectId, amount, ...rest });

//     const subcon = await SubconOrder.create({
//       projectId,
//       todo,
//       task,
//       staff,
//       architectId,
//       amount,
//       ...rest,
//     });

//     res.status(201).json({ subcon });
//   } catch (err) {
//     console.error("Create Subcon Error:", err);
//     res.status(500).json({ message: "Server error while creating subcon order" });
//   }
// };


// Get All Subcon Orders (with optional project filter)

const getSubconOrdersByProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid or missing projectId" });
    }

    const orders = await SubconOrder.find({ projectId })
      .populate("todo", "itemName")
      .populate("task", "name")
      .populate("staff", "name email")
      .populate("architectId", "name email")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No subcon orders found for this project" });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get Subcon Orders Error:", err);
    res.status(500).json({ message: "Server error while fetching subcon orders" });
  }
};

// Get Subcon Orders by Architect

const getSubconOrdersByArchitect = async (req, res) => {
  try {
    const { architectId } = req.query;

    if (!architectId || !mongoose.Types.ObjectId.isValid(architectId)) {
      return res.status(400).json({ message: "Invalid or missing architectId" });
    }

    const orders = await SubconOrder.find({ architectId })
      .populate("todo", "title")
      .populate("task", "name")
      .populate("staff", "name email")
      .populate("projectId", "name client")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No subcon orders found for this architect" });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get Subcon by Architect Error:", err);
    res.status(500).json({ message: "Server error while fetching subcon orders by architect" });
  }
};

// Get Single Subcon Order

const getSubconOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await SubconOrder.findById(id)
      .populate("todo", "title")
      .populate("task", "name")
      .populate("staff", "name email")
      .populate("architectId", "name email");

    if (!order) return res.status(404).json({ message: "Subcon order not found" });

    res.status(200).json({ order });
  } catch (err) {
    console.error("Get Subcon Order Error:", err);
    res.status(500).json({ message: "Server error while fetching subcon order" });
  }
};

// Update Subcon Order
const updateSubconOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let { projectId, todo, task, staff, architectId, amount, ...rest } = req.body;

    // Normalize empty strings to null
    todo = todo || null;
    task = task || null;

    // Required fields except todo/task
    if (!projectId || !staff || !architectId || !amount) {
      return res.status(400).json({
        message: "projectId, staff, architectId, and amount are required",
      });
    }

    // Ensure at least one of todo or task exists (either in payload or already in DB)
    if (!todo && !task) {
      const existingOrder = await SubconOrder.findById(id);
      if (!existingOrder?.todo && !existingOrder?.task) {
        return res.status(400).json({
          message: "Either todo or task must be provided",
        });
      }
    }

    console.log("Updating Sub-Con payload:", { projectId, todo, task, staff, architectId, amount, ...rest });

    const order = await SubconOrder.findByIdAndUpdate(
      id,
      { projectId, todo, task, staff, architectId, amount, ...rest },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ message: "Subcon order not found" });

    res.status(200).json({ order });
  } catch (err) {
    console.error("Update Subcon Error:", err);
    res.status(500).json({ message: "Server error while updating subcon order" });
  }
};
// const updateSubconOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { todo, task, projectId, staff, architectId, amount, ...rest } = req.body;

//     // Required fields except todo/task
//     if (!projectId || !staff || !architectId || !amount) {
//       return res.status(400).json({
//         message: "projectId, staff, architectId, and amount are required",
//       });
//     }

//     // At least one of todo or task should be provided (if neither exists in DB already)
//     if (!todo && !task) {
//       const existingOrder = await SubconOrder.findById(id);
//       if (!existingOrder?.todo && !existingOrder?.task) {
//         return res.status(400).json({
//           message: "Either todo or task must be provided",
//         });
//       }
//     }

//     // Log payload for debugging
//     console.log("Updating payload:", req.body);

//     const order = await SubconOrder.findByIdAndUpdate(
//       id,
//       { todo, task, projectId, staff, architectId, amount, ...rest },
//       { new: true, runValidators: true }
//     );

//     if (!order) {
//       return res.status(404).json({ message: "Subcon order not found" });
//     }

//     res.status(200).json({ order });
//   } catch (err) {
//     console.error("Update Subcon Error:", err);
//     res.status(500).json({ message: "Server error while updating subcon order" });
//   }
// };

// Patch Subcon Order (partial update)

const patchSubconOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await SubconOrder.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ message: "Subcon order not found" });

    res.status(200).json({ order });
  } catch (err) {
    console.error("Patch Subcon Error:", err);
    res.status(500).json({ message: "Server error while patching subcon order" });
  }
};

// Delete Subcon Order

const deleteSubconOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await SubconOrder.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Subcon order not found" });

    res.status(200).json({ message: "Subcon order deleted successfully" });
  } catch (err) {
    console.error("Delete Subcon Error:", err);
    res.status(500).json({ message: "Server error while deleting subcon order" });
  }
};

module.exports = {
  createSubconOrder,
  getSubconOrdersByProject,
  getSubconOrdersByArchitect,
  getSubconOrderById,
  updateSubconOrder,
  patchSubconOrder,
  deleteSubconOrder,
};
