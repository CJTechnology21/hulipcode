// controllers/purchaseOrderController.js
const PurchaseOrder = require("../models/PurchaseOrder");
const RFQ = require("../models/RFQ");

//  Punch quotation -> create a Purchase Order
const punchQuotation = async (req, res) => {
  try {
    const { id, responseId } = req.params; // RFQ ID + Supplier Response ID

    const rfq = await RFQ.findById(id)
      .populate("project", "name client location")
      .populate("suppliers", "name email phone role");

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    const response = rfq.responses.id(responseId);
    if (!response) {
      return res.status(404).json({ success: false, message: "Supplier response not found" });
    }

    // Create Purchase Order
    const po = new PurchaseOrder({
      rfq: rfq._id,
      supplier: response.supplier,
      architect: rfq.architect,
      project: rfq.project,
      quotes: response.quotes,
      tax: response.tax,
      totalAmount: response.totalAmount,
      status: "draft",
    });

    await po.save();

    res.status(201).json({
      success: true,
      message: "Purchase Order created successfully from supplier response",
      data: po,
    });
  } catch (error) {
    console.error("Error in punchQuotation:", error);
    res.status(500).json({
      success: false,
      message: "Error creating Purchase Order",
      error: error.message,
    });
  }
};

//  Get all Purchase Orders
const getAllPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.find()
      .populate("rfq", "status")
      .populate("supplier", "name email phone")
      .populate("architect", "name email")
      .populate("project", "name client location");

    res.status(200).json({ success: true, count: pos.length, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching POs", error: error.message });
  }
};

//  Get Purchase Order by ID
const getPOById = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate("rfq", "status")
      .populate("supplier", "name email phone")
      .populate("architect", "name email")
      .populate("project", "name client location");

    if (!po) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    res.status(200).json({ success: true, data: po });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching PO", error: error.message });
  }
};

// Get Purchase Orders by Supplier
const getPOsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const pos = await PurchaseOrder.find({ supplier: supplierId })
      .populate("rfq", "status")
      .populate("project", "name client location");

    if (!pos.length) {
      return res.status(404).json({ success: false, message: "No POs found for this supplier" });
    }

    res.status(200).json({ success: true, count: pos.length, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching supplier POs", error: error.message });
  }
};

//  Get Purchase Orders by Architect
const getPOsByArchitect = async (req, res) => {
  try {
    const { architectId } = req.params;
    const pos = await PurchaseOrder.find({ architect: architectId })
      .populate("rfq", "status")
      .populate("project", "name client location");

    if (!pos.length) {
      return res.status(404).json({ success: false, message: "No POs found for this architect" });
    }

    res.status(200).json({ success: true, count: pos.length, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching architect POs", error: error.message });
  }
};

//  Get Purchase Orders by Project
const getPOsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const pos = await PurchaseOrder.find({ project: projectId })
      .populate("rfq", "status")
      .populate("supplier", "name email phone");

    if (!pos.length) {
      return res.status(404).json({ success: false, message: "No POs found for this project" });
    }

    res.status(200).json({ success: true, count: pos.length, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching project POs", error: error.message });
  }
};

//  Update Purchase Order
const updatePO = async (req, res) => {
  try {
    const updatedPO = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("rfq", "status")
      .populate("supplier", "name email phone")
      .populate("architect", "name email")
      .populate("project", "name client location");

    if (!updatedPO) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    res.status(200).json({ success: true, message: "Purchase Order updated", data: updatedPO });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating PO", error: error.message });
  }
};

//  Delete Purchase Order
const deletePO = async (req, res) => {
  try {
    const deletedPO = await PurchaseOrder.findByIdAndDelete(req.params.id);

    if (!deletedPO) {
      return res.status(404).json({ success: false, message: "Purchase Order not found" });
    }

    res.status(200).json({ success: true, message: "Purchase Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting PO", error: error.message });
  }
};

module.exports = {
  punchQuotation,
  getAllPOs,
  getPOById,
  getPOsBySupplier,
  getPOsByArchitect,
  getPOsByProject,
  updatePO,
  deletePO,
};
