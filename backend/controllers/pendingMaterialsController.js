const PendingMaterial = require("../models/PendingMaterials");
const RFQ = require("../models/RFQ");

/**
 * Add a material to pending list (before RFQ is created)
 */
const addPendingMaterial = async (req, res) => {
  try {
    const material = new PendingMaterial(req.body);
    await material.save();
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error adding pending material", error: error.message });
  }
};

/**
 * Get all pending materials for a project
 */
const getPendingMaterialsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const materials = await PendingMaterial.find({ project: projectId, status: "pending" }).populate(
      "product",
      "name hsn unit"
    );
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching pending materials", error: error.message });
  }
};
//Get pending materials by its id 
const getPendingMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await PendingMaterial.findById(id).populate("product", "name hsn unit");
    if (!material) {
      return res.status(404).json({ success: false, message: "Pending material not found" });
    }
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending material",
      error: error.message,
    });
  }
};


/**
 * Approve & move all pending materials to an RFQ
 */
const movePendingToRFQ = async (req, res) => {
  try {
    const { rfqId } = req.params;
    const { projectId } = req.body; // which project to pull from

    // fetch RFQ
    const rfq = await RFQ.findById(rfqId);
    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    // fetch all pending materials for this project
    const pendingMaterials = await PendingMaterial.find({ project: projectId, status: "pending" });

    if (!pendingMaterials.length) {
      return res.status(400).json({ success: false, message: "No pending materials found" });
    }

    // push to RFQ.materials
    const materialsFormatted = pendingMaterials.map((m) => ({
      product: m.product,
      name: m.name,
      hsn: m.hsn,
      quantity: m.quantity,
      unit: m.unit,
      deliveryDate: m.deliveryDate,
    }));

    rfq.materials.push(...materialsFormatted);
    await rfq.save();

    // mark pending materials as approved (or delete them)
    await PendingMaterial.deleteMany({ project: projectId, status: "pending" });

    res.status(200).json({
      success: true,
      message: "Pending materials moved to RFQ",
      data: rfq.materials,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error moving materials", error: error.message });
  }
};
//update pending materials
const updatePendingMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await PendingMaterial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!material) {
      return res.status(404).json({ success: false, message: "Pending material not found" });
    }
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating pending material",
      error: error.message,
    });
  }
};

/**
 * Delete a pending material (if user cancels before RFQ)
 */
const deletePendingMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await PendingMaterial.findByIdAndDelete(id);
    if (!material) {
      return res.status(404).json({ success: false, message: "Pending material not found" });
    }
    res.status(200).json({ success: true, message: "Pending material deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting pending material", error: error.message });
  }
};

module.exports = {
  addPendingMaterial,
  getPendingMaterialsByProject,
  getPendingMaterialById,
  updatePendingMaterial,
  movePendingToRFQ,
  deletePendingMaterial,
};
